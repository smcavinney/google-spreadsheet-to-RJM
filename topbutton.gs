function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  var menuItems = [
    {name: 'Sync with RJMetrics', functionName: 'push'},
    {name: 'Change API Key', functionName: 'onInstall'}
  ];
  spreadsheet.addMenu('RJMetrics Import', menuItems);
  function auth() {}
  auth()
}