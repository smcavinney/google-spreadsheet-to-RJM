// This function is what kicks off the datasync. It will either loop through and send 100 records at a time, 
// or send the entire dataset,depending on the size of the document

function push(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getDataRange();
  var lastcolumn = range.getLastColumn();
  var newkey = normalizeHeaders(ScriptProperties.getProperty('PRIMARYKEY').split(','));

  var tablename = sheet.getSheetName();
  var firstrow = 2
// last row minus 1 assuming the first row is headers
  var lastrow = range.getLastRow() + 1;
  var i = 101;

  if (lastrow > i){
    largedoc(lastrow, lastcolumn, i, tablename, sheet, newkey)
    
  }
  else {smalldoc(lastrow, lastcolumn, i, firstrow, tablename, sheet, newkey)};
  
}

function insertKeys(spreadsheetdata, keys){
 var new_array = []
 var arrayLength = spreadsheetdata.length;
  for (var i = 0; i < arrayLength; i++) {
    //Logger.log('keys' + keys);
    var record = spreadsheetdata[i];
    record['keys'] = keys;
    new_array.push(record);
    //Logger.log(record);
  }
  
  return new_array
}

function largedoc(lastrow, lastcolumn, i, tablename, sheet, newkey){
  Logger.log('starting largedoc rows loop');
  // this first row setting is so the first row gets incremented by 100 at the beginning of the while loop instead of the end.
  var firstrow = -98;
  // send 100 rows at a time, asyncronosly. 
  while (lastrow >= i){
    firstrow = firstrow + 100
    //Logger.log('rows ' + firstrow + " - " + (firstrow + 100));
    var datarange = sheet.getRange(firstrow, 1, 100, lastcolumn);
    //Logger.log("datarange = " + datarange.getNumRows())
    var spreadsheetdata = getRowsData(sheet, datarange, 1);
    var payload_pre = insertKeys(spreadsheetdata, newkey);
    var payload = JSON.stringify(payload_pre);
    //Logger.log("Payload Length" + spreadsheetdata.length)
    //Logger.clear();
    var api = ScriptProperties.getProperty('RJMETRICSKEY');
    var cid = ScriptProperties.getProperty('RJMETRICSCID');
    var url = 'https://connect.rjmetrics.com/v2/client/' + cid + '/table/' + tablename + '/data?apikey=' + api;
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
  smalldoc(lastrow, lastcolumn, i, firstrow, tablename, sheet, newkey)
}

// For sending the entire document, if less than 100 rows, or for sending the remainder of a large document after the loop of 100 records at a time.
function smalldoc(lastrow, lastcolumn, i, firstrow, tablename, sheet, newkey){
  Logger.log('starting last rows');
  //Logger.log('rows ' + firstrow + " - " + lastrow);
  var length_left = lastrow - firstrow
  var datarange = sheet.getRange(firstrow, 1, length_left, lastcolumn);
  var spreadsheetdata = getRowsData(sheet, datarange, 1);
  var payload_pre = insertKeys(spreadsheetdata, newkey);
  //Logger.log("Payload Length" + spreadsheetdata.length);
  var payload = JSON.stringify(payload_pre);
  //Logger.clear();
  Logger.log(payload_pre.length);
  var api = ScriptProperties.getProperty('RJMETRICSKEY');
  var cid = ScriptProperties.getProperty('RJMETRICSCID');
  var url = 'https://connect.rjmetrics.com/v2/client/' + cid + '/table/' + tablename + '/data?apikey=' + api;
  var options = {
    'method': 'post',
    "contentType" : "application/json",
    "payload": payload
  };
  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response);
  return response
}
