function onInstall() {
  var key = Browser.inputBox("Input RJMetrics API Key here", Browser.Buttons.OK_CANCEL);
  var cid = Browser.inputBox("Input RJMetrics Client Id here", Browser.Buttons.OK_CANCEL);
  if(key && key!="cancel") ScriptProperties.setProperty("RJMETRICSKEY", key);
  if(cid && cid!="cancel") ScriptProperties.setProperty("RJMETRICSCID", cid);
  auth()
}

function auth() {}
