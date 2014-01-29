// This function is what kicks off the datasync. It will either loop through and send 100 records at a time, 
// or send the entire dataset,depending on the size of the document

function push(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getDataRange();
  var lastcolumn = range.getLastColumn();
  var tablename = ss.getSheetName();
  var firstrow = 2
// last row minus 1 assuming the first row is headers
  var lastrow = range.getLastRow() - 1;
  var i = 101;
  if (lastrow >= i){
    largedoc(lastrow, lastcolumn, i, tablename, sheet)
    
  }
  else {smalldoc(lastrow, lastcolumn, i, firstrow, tablename, sheet)};
  
}

function largedoc(lastrow, lastcolumn, i, tablename, sheet){
  Logger.log('starting largedoc rows loop');
  // this first row setting is so the first row gets incremented by 100 at the beginning of the while loop instead of the end.
  var firstrow = -98;
  // send 100 rows at a time, asyncronosly. 
  while (lastrow >= i){
    firstrow = firstrow + 100
    Logger.log('rows ' + firstrow + " - " + i);
    var datarange = sheet.getRange(firstrow, 1, i, lastcolumn);
    var spreadsheetdata = getRowsData(sheet, datarange, 1);
    var payload = JSON.stringify(spreadsheetdata);
    var api = ScriptProperties.getProperty('RJMETRICSKEY');
    var cid = ScriptProperties.getProperty('RJMETRICSCID');
    var url = 'https://connect.rjmetrics.com/v1/client/' + cid + '/table/' + tablename + '/data?apikey=' + api;
    var options = {
      'method': 'post',
      "contentType" : "application/json",
      "payload": payload
    };
    var response = UrlFetchApp.fetch(url, options);
    i = i + 100;
    // Uncomment if the import api is having issues is giving 504s or other connection errors.This make the script take a while to complete however.
    // Utilities.sleep(10000);
  }
  firstrow = firstrow + 100
  smalldoc(lastrow, lastcolumn, i, firstrow, tablename, sheet)
}

// For sending the entire document, if less than 100 rows, or for sending the remainder of a large document after the loop of 100 records at a time.
function smalldoc(lastrow, lastcolumn, i, firstrow, tablename, sheet){
  Logger.log('starting last rows');
  Logger.log('rows ' + firstrow + " - " + lastrow);
  var datarange = sheet.getRange(firstrow, 1, lastrow, lastcolumn);
  var spreadsheetdata = getRowsData(sheet, datarange, 1);
  var payload = JSON.stringify(spreadsheetdata);
  var api = ScriptProperties.getProperty('RJMETRICSKEY');
  var cid = ScriptProperties.getProperty('RJMETRICSCID');
  
  var url = 'https://connect.rjmetrics.com/v1/client/' + cid + '/table/' + tablename + '/data?apikey=' + api;
  var options = {
    'method': 'post',
    "contentType" : "application/json",
    "payload": payload
  };
  var response = UrlFetchApp.fetch(url, options);
  return response
}
