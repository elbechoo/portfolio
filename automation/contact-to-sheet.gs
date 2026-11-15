/**
 * Portfolio contact form -> Google Sheet, with an email alert.
 *
 * The site is static, so there is no server of its own. This script is the
 * backend: deployed as a Google Apps Script web app, it receives each form
 * submission, validates and enriches it, appends one row to the sheet, and
 * emails the owner a summary. The sheet doubles as a small pipeline tracker:
 * the Status column is a dropdown the owner updates by hand.
 *
 * Setup is in automation/README.md. Nothing here is secret; the web app URL
 * is public by design and the checks below are what keep it from being abused.
 */

const OWNER_EMAIL = 'hechem.znetti2004@gmail.com';
const SHEET_NAME = 'Contacts';
const SEND_ACKNOWLEDGEMENT = true;   // short "message received" email to the sender

// Order matters: rows are written in this order.
const COLUMNS = [
  'Received', 'Ref', 'Status', 'Name', 'Company', 'Role', 'Email', 'Phone',
  'Country', 'Regarding', 'Message', 'Email domain', 'Work email?',
  'Likely website', 'Page language', 'Source', 'Referrer',
];

const STATUSES = ['New', 'Replied', 'Interview', 'Offer', 'Closed'];

const LIMITS = { name: 120, company: 120, role: 120, email: 200, phone: 40,
                 country: 80, topic: 80, message: 4000, lang: 5, source: 80, referrer: 300 };

const PERSONAL_DOMAINS = [
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.fr', 'hotmail.com', 'hotmail.fr',
  'outlook.com', 'outlook.fr', 'live.com', 'live.fr', 'msn.com', 'icloud.com', 'me.com',
  'aol.com', 'gmx.com', 'gmx.fr', 'proton.me', 'protonmail.com', 'yandex.com', 'mail.com',
  'laposte.net', 'orange.fr', 'free.fr', 'topnet.tn', 'planet.tn',
];

// ── entry point ────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    const raw = parseBody_(e);
    const verdict = check_(raw);
    if (verdict === 'bot') return json_({ ok: true });          // pretend success, store nothing
    if (verdict) return json_({ ok: false, error: verdict });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);                                        // two submissions at once must not collide
    try {
      const row = buildRow_(raw, new Date());
      sheet_().appendRow(COLUMNS.map((c) => row[c]));
      notifyOwner_(row);
      if (SEND_ACKNOWLEDGEMENT) acknowledge_(row);
      return json_({ ok: true, ref: row.Ref });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server' });
  }
}

// A GET lets you open the URL in a browser to confirm the deployment is alive.
function doGet() {
  return json_({ ok: true, service: 'portfolio-contact' });
}

// ── validation ─────────────────────────────────────────────────────────────

function parseBody_(e) {
  const text = e && e.postData && e.postData.contents;
  if (!text) return {};
  try { return JSON.parse(text); } catch (_) { return {}; }
}

/** Returns null when the submission is acceptable, otherwise a reason. */
function check_(d) {
  // Honeypot: a field hidden from people. Only scripts fill it in.
  if (d.website) return 'bot';
  // Nobody fills five fields in under three seconds.
  if (Number(d.elapsedMs) > 0 && Number(d.elapsedMs) < 3000) return 'bot';

  if (!clean_(d.name)) return 'name';
  if (!clean_(d.company)) return 'company';
  if (!isEmail_(clean_(d.email))) return 'email';
  if (clean_(d.message).length < 10) return 'message';
  if (d.consent !== true) return 'consent';

  // At most three submissions per address per hour.
  const cache = CacheService.getScriptCache();
  const key = 'n:' + clean_(d.email).toLowerCase();
  const n = Number(cache.get(key) || 0);
  if (n >= 3) return 'rate';
  cache.put(key, String(n + 1), 3600);
  return null;
}

function isEmail_(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= LIMITS.email;
}

// ── enrichment ─────────────────────────────────────────────────────────────

function buildRow_(d, now) {
  const email = clean_(d.email, LIMITS.email).toLowerCase();
  const domain = email.split('@')[1] || '';
  const personal = PERSONAL_DOMAINS.indexOf(domain) !== -1;

  return {
    'Received': now,
    'Ref': makeRef_(now),
    'Status': 'New',
    'Name': safe_(clean_(d.name, LIMITS.name)),
    'Company': safe_(clean_(d.company, LIMITS.company)),
    'Role': safe_(clean_(d.role, LIMITS.role)),
    'Email': safe_(email),
    'Phone': safe_(clean_(d.phone, LIMITS.phone)),
    'Country': safe_(clean_(d.country, LIMITS.country)),
    'Regarding': safe_(clean_(d.topic, LIMITS.topic)),
    'Message': safe_(clean_(d.message, LIMITS.message, true)),
    'Email domain': domain,
    'Work email?': personal ? 'No' : 'Yes',
    // A company address usually means the company site lives on the same domain.
    'Likely website': personal || !domain ? '' : 'https://' + domain,
    'Page language': safe_(clean_(d.lang, LIMITS.lang)),
    'Source': safe_(clean_(d.source, LIMITS.source)) || 'direct',
    'Referrer': safe_(clean_(d.referrer, LIMITS.referrer)),
  };
}

function makeRef_(now) {
  const stamp = Utilities.formatDate(now, 'Africa/Tunis', 'yyMMdd');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return 'HZ-' + stamp + '-' + rand;
}

/** Trim, collapse whitespace (keeping line breaks in long text), cap length. */
function clean_(v, max, keepLines) {
  if (v === undefined || v === null) return '';
  let s = String(v).replace(/\r\n?/g, '\n');
  s = keepLines ? s.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n')
                : s.replace(/\s+/g, ' ');
  s = s.trim();
  return max ? s.slice(0, max) : s;
}

/**
 * Spreadsheet formula injection: a cell that starts with = + - @ is executed
 * as a formula when the sheet is opened or exported to Excel. Anything typed
 * by a stranger is stored as text instead.
 */
function safe_(s) {
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

// ── output ─────────────────────────────────────────────────────────────────

function notifyOwner_(r) {
  const subject = 'Portfolio contact: ' + r.Name + ', ' + r.Company + ' (' + (r.Regarding || 'general') + ')';
  const lines = [
    'New message from the portfolio contact form.', '',
    'Ref:        ' + r.Ref,
    'Name:       ' + r.Name,
    'Company:    ' + r.Company,
    'Role:       ' + (r.Role || '-'),
    'Email:      ' + r.Email + (r['Work email?'] === 'Yes' ? '' : '  (personal address)'),
    'Phone:      ' + (r.Phone || '-'),
    'Country:    ' + (r.Country || '-'),
    'Regarding:  ' + (r.Regarding || '-'),
    'Source:     ' + r.Source, '',
    r.Message, '',
    'Sheet: ' + SpreadsheetApp.getActive().getUrl(),
  ];
  MailApp.sendEmail({ to: OWNER_EMAIL, replyTo: r.Email.replace(/^'/, ''), subject: subject, body: lines.join('\n') });
}

function acknowledge_(r) {
  const fr = r['Page language'] === 'fr';
  const subject = fr ? 'Message bien reçu, Hachem Zenati' : 'Message received, Hachem Zenati';
  const body = fr
    ? 'Bonjour ' + r.Name + ',\n\nMerci pour votre message. Je vous réponds sous un jour ouvré.\n\nRéférence : ' + r.Ref + '\n\nHachem Zenati\nAnalyste / ingénieur BI'
    : 'Hello ' + r.Name + ',\n\nThank you for your message. I will reply within one working day.\n\nReference: ' + r.Ref + '\n\nHachem Zenati\nBI / Analytics Engineer';
  MailApp.sendEmail({ to: r.Email.replace(/^'/, ''), replyTo: OWNER_EMAIL, subject: subject, body: body, name: 'Hachem Zenati' });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ── one-time sheet setup ───────────────────────────────────────────────────

function sheet_() {
  const ss = SpreadsheetApp.getActive();
  return ss.getSheetByName(SHEET_NAME) || setup();
}

/** Run once from the editor: creates the tab, header, formats and Status dropdown. */
function setup() {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sh.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS])
    .setFontWeight('bold').setBackground('#1f3864').setFontColor('#ffffff');
  sh.setFrozenRows(1);
  sh.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm');
  sh.getRange('C2:C').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build());
  sh.getRange('K:K').setWrap(true);
  const widths = { A: 130, B: 120, C: 90, D: 150, E: 160, F: 140, G: 210, H: 120, I: 100,
                   J: 140, K: 380, L: 140, M: 90, N: 180, O: 90, P: 100, Q: 200 };
  Object.keys(widths).forEach((col) => sh.setColumnWidth(sh.getRange(col + '1').getColumn(), widths[col]));
  // New rows stand out until the owner changes their status.
  const rule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$C2="New"').setBackground('#fff4cc')
    .setRanges([sh.getRange(2, 1, sh.getMaxRows() - 1, COLUMNS.length)]).build();
  sh.setConditionalFormatRules([rule]);
  return sh;
}
