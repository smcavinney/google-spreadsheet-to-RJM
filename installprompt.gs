function onInstall() {
  var key = Browser.inputBox("Input RJMetrics API Key here", Browser.Buttons.OK_CANCEL);
  var cid = Browser.inputBox("Input RJMetrics Client Id here", Browser.Buttons.OK_CANCEL);
  var primaryKey = Browser.inputBox("Enter a comma separated list of the primary key(s). Usually this will be one column, but if multiple columns make a row unique, add more.", Browser.Buttons.OK_CANCEL);
  if(key && key!="cancel") ScriptProperties.setProperty("RJMETRICSKEY", key);
  if(cid && cid!="cancel") ScriptProperties.setProperty("RJMETRICSCID", cid);
  if(primaryKey && primaryKey!="cancel") ScriptProperties.setProperty("PRIMARYKEY", primaryKey);
  auth()
}

function auth() {}
