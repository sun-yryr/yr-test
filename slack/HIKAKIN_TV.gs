var sheetID = ""
var imageURL = ""

function poseMessage() {
  var Token = PropertiesService.getScriptProperties().getProperty("slack_access_token");
  var APIkey = PropertiesService.getScriptProperties().getProperty("API_key");

  var sheet = new Ssheet(sheetID);
  var count = sheet.getLastColumn(0);
  var log = new Doc("");
  
  for (var i=2;i<=count;i++){
    var channelID = sheet.getValue(0,2,i);
    var oldTime = sheet.getValue(0,3,i);
    
    //プロパティ入手
    var response = UrlFetchApp.fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + channelID +"&key=" + APIkey + "&order=date&maxResults=1");
    var snippet = response.getContentText("UTF-8");
    var id = snippet.split('"')[45];
    var dated = new Date(snippet.split('"')[51]); //gooleさんは神なのでシリアル値変換が楽々
    var newTime = getDateAndTime(dated);
      
    
    if (oldTime < newTime) {
      log.print(sheet.getValue(0,1,i) + "　更新\n");
      log.print("old:" + oldTime + "\n");
      log.print("new:" + newTime + "\n\n");
      var HIKAurl = 'http://www.youtube.com/watch?v=' + id;
      
      //slackにhikaURLを送信。チャンネルは決め打ちなう
      var slackApp = SlackApp.create(Token);
      var channelID = "#hikakin_tv" // G5QPWG4QG
      imageURL = sheet.getValue(0,4,i);
      slackApp.postMessage(channelID,"",{
        icon_url : imageURL,
        username : "YouTuber更新bot",
        text : sheet.getValue(0,1,i) + "が更新されました！\n" + HIKAurl
      });
      sheet.setValue(0,3,i,newTime);
    }
  }
}

//-----------------------日付や時間のための関数群
function getSerial(date,time){//日付と時間からシリアル値をゲット
  var serial = new Date(date.toString().slice(0,16)+time.toString().slice(16));
  return serial;
}

function getDateAndTime(data){// 引数がゼロなら現在日時そうでなければ指定日時をyyyymmdd_hhmmssで返す
  if(data==0) var now = new Date();
  else        var now = new Date(data);
  var year = now.getYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours();
  var min = now.getMinutes();
  var sec = now.getSeconds();
  return (""+year).slice(0,4) + ("0"+month).slice(-2) + ("0"+day).slice(-2) +'_'+ 
    ("0"+hour).slice(-2) + ("0"+min).slice(-2) + ("0"+sec).slice(-2);
}

//-----------------------ファイルの新規作成等の関数群
//フォルダID，ファイルID，ファイル名を受け取り，ファイルIDのコピーをフォルダ内に作成して，ファイルのIDを返す
function copyFileInFolder(folderID, srcID, fileName) {
  var originalFile = DriveApp.getFileById(srcID);
  var folder = DriveApp.getFolderById(folderID);
  var copiedFile = originalFile.makeCopy(fileName, folder);
  copiedFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);//リンクからアクセスできる人は編集可能にする
  var copiedFileId = copiedFile.getId();//コピーのファイルIDをゲット
  return copiedFileId;
}
//フォルダID，ファイル名を受け取り，スプレッドシートを指定フォルダ内に新規作成しそのファイルIDを返す
function createSpreadsheetInFolder(folderID, fileName) {
  var folder = DriveApp.getFolderById(folderID);
  var newSS=SpreadsheetApp.create(fileName);
  var originalFile=DriveApp.getFileById(newSS.getId());
  var copiedFile = originalFile.makeCopy(fileName, folder);
  DriveApp.getRootFolder().removeFile(originalFile);
  var copiedFileId = copiedFile.getId();//コピーのファイルIDをゲット
  return copiedFileId;
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

//////////Docクラスの定義開始（コンストラクタとメンバ関数で構成）
//Docクラスのコンストラクタの記述
Doc = function(id){
  this.ID = id;
  this.doc = DocumentApp.openById(this.ID); 
  this.body = this.doc.getBody();
  this.docText = this.body.editAsText();
}
//Docクラスのメンバ関数の定義開始
//メソッドprintの定義，テキスト追加
Doc.prototype.print = function(str){
  this.docText.appendText(str);
}
//メソッドreplaceの定義，文字列置き換え
Doc.prototype.replace = function(src,dst){
  this.body.replaceText(src,dst);
}
//メソッドclearの定義，全消去
Doc.prototype.clear = function(){
  this.body.clear();
}
//メソッドgetIDの定義，ファイルIDを返す
Doc.prototype.getID = function(){
  return this.ID;
}
//指定秒数のウェイト，表示動作を遅らせたい時などに使用
Doc.prototype.waitSec = function(sec){
  var start = new Date().getSeconds();
  while((new Date().getSeconds()-start) < sec);
}
//指定ミリ秒のウェイト，表示動作を遅らせたい時などに使用
Doc.prototype.waitMiliSec = function(msec){
  var start = new Date(); //new Date()は，「1970年1月1日午前0時」からの通算ミリ秒を返す
  while((new Date()-start) < msec);
}
//今現在の日時を表示
Doc.prototype.printTodayNow = function(){
  var now = new Date();
  var year = now.getYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours();
  var min = now.getMinutes();
  var sec = now.getSeconds();
  this.docText.appendText(year +'_'+ ("0"+month).slice(-2) +'_'+ ("0"+day).slice(-2) +' '+ 
    ("0"+hour).slice(-2) +'-'+ ("0"+min).slice(-2) +'-'+ ("0"+sec).slice(-2));
}
/////////Docクラスの定義終了

