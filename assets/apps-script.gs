/**************************************************************************
 *  Karla & Jonty wedding site — Google Sheets endpoint
 *  ----------------------------------------------------------------------
 *  This script receives RSVP and Quiz submissions from the website and
 *  appends them as rows to your Google Sheet.
 *
 *  HOW TO SET IT UP (about 3 minutes, once):
 *  1. Open your Google Sheet:
 *     https://docs.google.com/spreadsheets/d/1kzcBaQotJa962IXPfuWjXpDqPZTJIhldpB5JhKWegEo/edit
 *  2. Make sure it has two tabs named exactly:  RSVPs   and   quiz answers
 *     (the script will create them and add headers if they are missing).
 *  3. In the Sheet, go to  Extensions ▸ Apps Script.
 *  4. Delete anything in the editor, paste THIS ENTIRE FILE in, and Save.
 *  5. Click  Deploy ▸ New deployment.
 *       - Select type:  Web app
 *       - Description:   Wedding site
 *       - Execute as:    Me
 *       - Who has access: Anyone
 *     Click Deploy, then Authorize access (allow it for your account).
 *  6. Copy the Web app URL it gives you (it ends in /exec).
 *  7. Paste that URL into assets/config.js, between the quotes on the
 *     line:  window.KJ_SHEETS_WEBHOOK = "";
 *
 *  That's it. New RSVPs and quiz scores will appear in your Sheet.
 *  (If you ever change this script, do Deploy ▸ Manage deployments ▸
 *   edit ▸ New version so the change goes live.)
 **************************************************************************/

var SHEET_ID = '1kzcBaQotJa962IXPfuWjXpDqPZTJIhldpB5JhKWegEo';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SHEET_ID);

    if (data.type === 'quiz') {
      var qs = getOrCreateSheet_(ss, 'quiz answers',
        ['Timestamp', 'Name', 'Score', 'Out of']);
      qs.appendRow([new Date(), data.name || '', data.score, data.total]);
    } else {
      var rs = getOrCreateSheet_(ss, 'RSVPs',
        ['Timestamp', 'Name', 'Attending', 'Dietary', 'Song requests', 'Note']);
      rs.appendRow([
        new Date(),
        data.name || '',
        data.attending === 'yes' ? 'Yes' : 'No',
        data.dietary || '',
        (data.songs || []).join('  |  '),
        data.note || ''
      ]);
    }
    return json_({ result: 'ok' });
  } catch (err) {
    return json_({ result: 'error', message: String(err) });
  }
}

function getOrCreateSheet_(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
