function channellist(){ 
  var token = PropertiesService.getScriptProperties().getProperty("slack_access_token");
  var channelNum = PropertiesService.getScriptProperties().getProperty("channelNum");
  var sheet = new Ssheet("");
  
  var slackApp = SlackApp.create(token);
  var channelID;
  var i = 0;
  while((slackApp.channelsList().channels[i])!=undefined){
    channelID = slackApp.channelsList().channels[i].name;
    sheet.setValue(0,i+1,1,channelID);
    i++;
  }
  if(channelNum != i){
    var message = "";
    for (var j=(channelNum+1);j<=i;j++) {
      message += "・" + sheet.getValue(0,j,1) + "\n";
    }
  
    slackApp.postMessage("#yryr","",{
      username :"new_Channel",
      text :"本日追加されたChannel\n" + message
    });
    
     PropertiesService.getScriptProperties().setProperty("channelNum",i);
  }
}


//////////Ssheetクラスの定義開始（コンストラクタとメンバ関数で構成）
//Ssheetクラスのコンストラクタの記述
Ssheet = function(id){
  this.ssFile = SpreadsheetApp.openById(id);
  this.ssFileName = this.ssFile.getName();
  SpreadsheetApp.setActiveSpreadsheet(this.ssFile);//値を返さない
  this.activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
}
//Ssheetクラスのメンバ関数（メソッド）の定義開始
//spreadsheetのファイル名を返すメソッド
Ssheet.prototype.getFileName = function(){
  return this.ssFileName;
}
//spreadsheetのファイル名を変更するメソッド
Ssheet.prototype.rename = function(newName){
  this.ssFile.rename(newName);
}
//spreadsheetのsheetでrow行cal列にデータを入れるメソッド
Ssheet.prototype.setValue = function(sheet,row,col,value){
  this.activeSheet = this.activeSpreadsheet.getSheets()[sheet];
  var cell = this.activeSheet.getRange(row,col);
  cell.setValue(value);
}
//spreadsheetのsheetでrow行cal列をクリアするメソッド
Ssheet.prototype.clear = function(sheet,row,col,value){
  this.activeSheet = this.activeSpreadsheet.getSheets()[sheet];
  var cell = this.activeSheet.getRange(row,col);
  cell.clear(value);
}
//spreadsheetのsheetからrow行のcal列のデータをもらってくるメソッド
Ssheet.prototype.getValue = function(sheet,row,col) {
  this.activeSheet = this.activeSpreadsheet.getSheets()[sheet];
  var value = this.activeSheet.getRange(row, col).getValue();
  return value;
}
//背景の色を設定するメソッド
Ssheet.prototype.setBackgroundColor = function(sheet,row,col, r,g,b) {
  this.activeSheet = this.activeSpreadsheet.getSheets()[sheet];
  var cell = this.activeSheet.getRange(row,col);
  cell.setBackgroundRGB(r,g,b);
}
//spreadsheetのsheet数を指定の数増やすメソッド
Ssheet.prototype.insertSheet = function(num){
  var sheetNum = this.activeSpreadsheet.getNumSheets();
  while(num>sheetNum){
    this.activeSpreadsheet.insertSheet();
    sheetNum++;
  }
}
//spreadsheetの指定sheetを削除
Ssheet.prototype.deleteSheet = function(sheet){
  this.activeSpreadsheet.deleteSheet(this.activeSpreadsheet.getSheets()[sheet])
}
//spreadsheetのsheetの名前をセットするメソッド
Ssheet.prototype.renameSheet = function(sheet,newName){
  this.activeSheet = this.activeSpreadsheet.getSheets()[sheet];
  this.activeSheet.setName(newName);
}
//spreadsheetの指定sheetの全データを取得
Ssheet.prototype.getValues = function(sheet){
  this.activeSheet = this.activeSpreadsheet.getSheets()[sheet];
  return this.activeSheet.getDataRange().getValues();//シートの全データを取得
}  
//spreadsheetの指定sheetを取得
Ssheet.prototype.getSheet = function(sheet){
  this.activeSheet = this.activeSpreadsheet.getSheets()[sheet];
  return this.activeSheet;//シートを返す
}
//spreadsheetの指定sheetの最後の行番号を取得
Ssheet.prototype.getLastRow = function(sheet){
  this.activeSheet = this.activeSpreadsheet.getSheets()[sheet];
  return this.activeSheet.getLastRow();//最後の行番号を取得
}
//spreadsheetの指定sheetの最後の列番号を取得
Ssheet.prototype.getLastColumn = function(sheet){
  this.activeSheet = this.activeSpreadsheet.getSheets()[sheet];
  return this.activeSheet.getLastColumn();//最後の列番号を取得
}
//spreadsheetの指定行rowを削除
Ssheet.prototype.deleteRow = function(sheet,row){
  this.activeSheet = this.activeSpreadsheet.getSheets()[sheet];
  this.activeSheet.deleteRow(row);//行を削除
}
//spreadsheetの指定行rowを挿入
Ssheet.prototype.insertRow = function(sheet,row){
  this.activeSheet = this.activeSpreadsheet.getSheets()[sheet];
  this.activeSheet.insertRows(row);//行を挿入
}
//spreadsheetの指定列colを削除
Ssheet.prototype.deleteColumn = function(sheet,col){
  this.activeSheet = this.activeSpreadsheet.getSheets()[sheet];
  this.activeSheet.deleteColumn(col);//列を削除
}
//spreadsheetの指定列colを挿入
Ssheet.prototype.insertColumn = function(sheet,col){
  this.activeSheet = this.activeSpreadsheet.getSheets()[sheet];
  this.activeSheet.insertColumns(col);//列を挿入
}
//////////Ssheetクラスの定義終了