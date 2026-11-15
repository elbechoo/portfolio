# Contact form to Google Sheet

Every message sent through the portfolio's contact form becomes one row in a Google Sheet,
and you get an email alert with a Reply-To set to the sender. The sender gets a short
confirmation with a reference number. The sheet has a **Status** dropdown
(New, Replied, Interview, Offer, Closed) so it works as a small tracker, and new rows are
highlighted until you change their status.

```
visitor fills the form  ->  Apps Script web app  ->  validate, clean, enrich  ->  new row in the sheet
                                                                             ->  email alert to you
                                                                             ->  confirmation to them
```

What the script adds on top of what the visitor typed: a timestamp, a reference
(`HZ-261115-K7QX`), the email domain, whether it is a work or personal address, the likely
company website, the page language, and where the visitor came from (`?src=fair` on a link).

Spam handling: a hidden honeypot field, a minimum fill time of three seconds, at most three
messages per address per hour, and length caps. Anything starting with `=`, `+`, `-` or `@`
is stored as text, so nobody can plant a formula in your sheet that runs when you open it in Excel.

## Setup, about ten minutes, once

1. Go to [sheets.new](https://sheets.new) and name the sheet `Portfolio contacts`.
2. In the sheet: **Extensions → Apps Script**. Delete what is in the editor, paste the whole of
   `contact-to-sheet.gs`, and save.
3. In the function dropdown at the top choose **setup**, click **Run**, and accept the
   permissions (it needs the sheet and permission to send email as you).
   A `Contacts` tab appears with the header row.
4. **Deploy → New deployment →** type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**

   Click Deploy and copy the URL that ends in `/exec`.
5. Open that URL in a browser. You should see `{"ok":true,"service":"portfolio-contact"}`.
6. In `src/content.js`, paste it into:

   ```js
   export const CONTACT_ENDPOINT = 'https://script.google.com/macros/s/.../exec'
   ```

   Commit and push. Send yourself a test message from the live site.

Until step 6 is done the form still works: it opens a prefilled email instead.

## Getting it into Excel

**File → Download → Microsoft Excel (.xlsx)** in the sheet, whenever you want a copy.

Do not use "Publish to web" to feed Excel automatically: it makes the sheet readable by anyone
who has the link, and these rows are other people's names, emails and phone numbers.

## Changing the script later

Edit it in the Apps Script editor, then **Deploy → Manage deployments → edit (pencil) →
Version: New version → Deploy**. The URL stays the same, so the site needs no change.
