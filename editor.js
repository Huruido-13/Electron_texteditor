var editor = null;
var folder_path = null;
var folder_items = null
var current_fname = null;
var footer = null;
var sidebar = null;
var change_flg = false;
var filledId = null;
var fpath = null;
var pdfCounter = 1;
var htmlCounter = 1000;
var tag = '';
var familyTag = "";
var bufTag = "";
var dirListPathArray = [];
var fisrtCheck = true;
var contextcheck = false;

let menu_temp = [
        {role:'cut'},
        {role:'copy'},
        {role:'paste'},
    ];

let menu = Menu.buildFromTemplate(menu_temp);

window.addEventListener('contextmenu', (e) =>{
    if(!contextcheck){
        e.preventDefault();
        menu.popup({window:remote.getCurrentWindow()}) 
    }

}, false);

window.addEventListener('DOMContentLoaded', onLoad);

function onLoad(){
    let w = BrowserWindow.getFocusedWindow();
    //ウィンドウが閉じられた際に発生するイベントでファイルを自動保存
    w.on('close', (e) =>{
        savefile()
    })
    const editor_area = document.querySelector("#editor_area")
    footer = document.querySelector("#footer");
    sidebar = document.querySelector("#sidebar");
    editor = ace.edit('editor_area');
    editor.setShowPrintMargin(false);
    editor.setTheme('ace/theme/chaos');
    editor.session.setMode("ace/mode/text");
    editor.focus();
    //ドキュメントが変更された際に発生するイベントでフラグをTRUEにする
    editor.session.getDocument().on('change', (ob) =>{
        change_flg = true;
    });

    sidebar.addEventListener('dragover', (event)=>{
        event.preventDefault();
        event.stopPropagation();
        console.log("dragover")
    });
    
    sidebar.addEventListener('drop', (event) =>{
        event.preventDefault();
        event.stopPropagation();
        console.log("drop")
        editor.session.getDocument().setValue('');
        change_flg = false;
        const folder = event.dataTransfer.files[0];
        folder_path = folder.path;
        loadPath();
    });
}

function setTheme(tname){
    editor.setTheme('ace/theme/' + tname);
}

function setMode(mname){
    editor.session.setMode('ace/mode/' + mname);
}

function setFontSize(fontSize){
    editor.setFontSize(fontSize);
}

//ダイアログを表示し、任意のディレクトリを選択させる
function openfolder(){
    let w = BrowserWindow.getFocusedWindow();
    let result = dialog.showOpenDialogSync(w, {
        properties:['openDirectory']
    });
    //ディレクトリを開かないとundefinedがリターンする
    if (result !== undefined){
        folder_path = result[0];
        loadPath()
        footer.textContent = 'open dir:"' + folder_path + '".';
    } 
    else{
        alert("ディレクトリは開かれませんでした。")
    }
}

//ダイアログから開かれたディレクトリを読み込み、ファイルを一覧としてサイドバーに表示する
function loadPath(){
    let dirArray = fs.readdirSync(folder_path)
    folder_items = dirArray;
    tag = '<ul>';

    for (const n in dirArray){
    try {
        fpath = folder_path + "\\" + dirArray[n];
    if(fs.statSync(fpath).isDirectory()){
        //ファイルシステムツリーは未実装なためコンティニューする
        continue;
        getFileList(fpath, concatFileListString)
    }

    else{
        tag += '<li id="item ' + n + '" onclick="openfile(' + n 
        + ')"  oncontextmenu="fileContextMenu(' + n + ')">' + dirArray[n] + '</li>'; 
    }
} 
    catch(err) {
    alert(err.code,err.message)}
    }

    
    console.log(tag);
    sidebar.innerHTML = tag + '</ul>';
    

}

//fs.readdir()から受け取ったディレクトリ内のファイルの配列からファイルを取得
function openfile(n){
    //サイドバーのファイルがクリックされた際にフラグがTRUEならファイルを保存する
    savefile();
    if(filledId !== null){
        clearBackground(filledId);
    }
    current_fname = folder_items[n];
    fpath = path.join(folder_path, current_fname);
    fpathExtention = path.extname(fpath);

    switch (fpathExtention) {
        case '.pdf':
            openPDF(fpath);
            editor.session.getDocument().setValue("");
            footer.textContent = ' "' + fpath + '" loaded.';
            fillBackground(n);
            filledId = n;
            break;
        case '.py':
            
        case '.js':
        
        case '.txt':

        case '.c': 
        
        case '.cpp':
            
        case '.java':
        
        case '.xml':
            
        case '.html':

        case '.json':
            
        case '.css':
            fs.readFile(fpath, (err,result) =>{
                if(err === null){
                    let data = result.toString();
                    editor.session.getDocument().setValue(data);
                    editor.setFontSize(18)
                    change_flg = false;
                    footer.textContent = ' "' + fpath + '" loaded.';
                    setExt(current_fname);
                    fillBackground(n);
                    filledId = n;
                }
                else{
                    dialog.showErrorBox(err.code + err.errno + err.message);
                }
            })
            break;
        default:
            alert('テキストファイル以外は表示できません');
            editor.session.getDocument().setValue("");
            break;
    }

}

//拡張子によってMODEを変更する
function setExt(fname){
    let ext = path.extname(fname);
    switch(ext){
        case '.txt':
            setMode("text");
            break;
        case '.js':
            setMode('javascript');
            break;
        case '.json':
            setMode('javascript');
            break;
        case '.html':
            setMode('html');
            break;
        case '.py':
            setMode('python');
            break;
        case '.php':
            setMode('php');
            break;
        default:
            return;
    }
}

function savefile(){
    if(!change_flg){
        return;
    }
    let fpath = path.join(folder_path, current_fname);
    let data = editor.session.getDocument().getValue();
    fs.writeFile(fpath, data, (err) =>{
        if(err === null){
            change_flg = false;
        }
    });
}

function createfile(){
    $('#save-modal').modal('show');
}

async function createfileresult(){
    current_fname = document.querySelector("#input_file_name").value;
    if(folder_path === null){
        folder_path = await dialog.showOpenDialog({
            properties:['openDirectory'],
            title:"Select File",
            buttonLabel:"Load",})
        folder_path = folder_path.filePaths[0].toString();
        console.log(typeof(folder_path));
    }
    let fpath = path.join(folder_path, current_fname);
    fs.writeFile(fpath, '', (err) =>{
        editor.session.getDocument().setValue('');
        footer.textContent = '"' + current_fname + '" created.';
        change_flg = false;
        loadPath();
    })
}

function fileContextMenu(n){
    contextcheck = true;
    let menu_temp = [
        {
            label:'Delete File',click: ()=>{
                deleteFile(n);
            }
        }
    ]
    let menu = Menu.buildFromTemplate(menu_temp);
    menu.popup({window:remote.getFocusedWindow})
}

function deleteFile(n){
    current_fname = folder_items[n];
    let fpath = path.join(folder_path, current_fname);
    fs.unlink(fpath, (err) =>{
        if(err){
            alert("削除できませんでした。")
            return;
        }
        alert("削除しました。")
        loadPath()
    })
    filledId = null;
}

function fillBackground(n){
    let elemId = "item " + n;
    let elem = document.getElementById(elemId);
    elem.style.background = '#808080';
}

function clearBackground(filledId){
    let elemId = "item " + filledId;
    try{
        let elem = document.getElementById(elemId);
        elem.style.background = '#505050';
    }
    catch{
        fillBackground(filledId);
    }


}

function find(){
    $('#find-modal').modal('show');
}

function search(){
    let fstr = document.querySelector('#input_find').value;
    editor.focus();
    console.log(fstr);
    editor.find(fstr,{
        backwards: false,
        wrap: false,
        caseSensitive: false,
        wholeWord: true,
        regExp: false
    });
}

function findNext(){
    editor.findNext();
}

function findPrev(){
    editor.findPrevious();
}

function PrintToPDF(){

    let win = BrowserWindow.getFocusedWindow();
    let isExist = true;

    var options = {
        marginsType: 0,
        pageSize: 'A4',
        printBackground: true,
        printSelectionOnly: false,
        landscape: false
    }

    

    while(isExist){
        const secondPath = "print" + pdfCounter + '.pdf';
        pdfPath = path.join(folder_path,secondPath);
        try{
            fs.statSync(pdfPath);
            isExist = true;
            ++pdfCounter;
        }
        catch{
            isExist = false
        }
    }

    win.webContents.printToPDF(options).then(data => {
        fs.writeFile(pdfPath, data, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('PDF Generated Successfully');
                loadPath();
            }
            pdfCounter++;
        });
    }).catch(error => {
        console.log(error)
    });

}

function openPDF(PDFpath){
    alert("PDFビューワーから開いてください")
    // win = new BrowserWindow({
    //     width: 800,
    //     height: 600,
    //     webPreferences:{
    //         nodeIntegration:true,
    //         enableRemoteModule: true,
    //         contextIsolation: false,
    //         defaultFontFamily:{
    //             defaultFontSize:24
    //         },
    //         preload:path.join(app.getAppPath(), 'preload.js')
    //     }
    // });
    // win.loadFile('./PDFVIEWER/pdfviewer.html');
    // win.webContents.openDevTools();
    // PDFpath = 'loadPDFfromEditor("' + PDFpath + '")';
    // console.log(PDFpath);
    // win.webContents.executeJavaScript('btnClick()');

}

function replace(){
    document.querySelector("#input_find2").value = "";
    document.querySelector("#input_replace").value = "";
    $("#replace-modal").modal('show');
}

function replacenow(){
    let fstr = document.querySelector("#input_find2").value;
    console.log(fstr);
    editor.focus();
    editor.find(fstr,{
        backwards: false,
        wrap: false,
        caseSensitive: false,
        wholeWord: false,
        regExp: false
    });
    replacenext();
}

function replacenext(){
    let rstr = document.querySelector('#input_replace').value;
    console.log(rstr);
    editor.replace(rstr,{
        backwards: false,
        wrap: false,
        caseSensitive: false,
        wholeWord: false,
        regExp: false
    })
}

function toString (bytes) {
    return Encoding.convert(bytes, {
    from: 'SJIS',
    to: 'UNICODE',
    type: 'string',
    });
};

function openTerminal(){
    $("#terminal-modal").modal('show');
}

function doCommand(){
    let cmd = document.querySelector('#input_cmd').value;
    const stdout = execSync(cmd);
    console.log(toString(stdout));
}

// ファイルシステムツリーの構築案
function getFileList(dirpath, callback){
    /*ディレクトリを読み取り、fs.statプロパティを使ってファイルかディレクトリか判断する
　　ディレクトリなら再帰し、ファイルならHTML要素を作成する　この再帰関数によってファイルシステムツリーを構築する*/
    //ディレクトリ内のファイルの配列を返す
    let dirArray = fs.readdirSync(dirpath);
    dirListPathArray.push(dirpath);
    if(!dirArray){
        throw err("Can't read directory");
    }

    for (const fileOrDir of dirArray) {

        const fp = path.join(dirpath, fileOrDir);


        if (fs.statSync(fp).isDirectory()) {
            console.log(fp)
            getFileList(fp, callback);
            //ファイルの出力ループを抜けるとここに戻ってくる
            callback(fileOrDir, 1);
            //ファイルに到達するとelse節が実行される
        } else {
            callback(fileOrDir);
            console.log("dekiteruyo")
        }
    }

}

function concatFileListString(filename, checkDir){
    if(checkDir === 1){
        if(fisrtCheck){
            familyTag = '<details><summary>' + filename + '</summary>';
            tag += familyTag + bufTag + '</details>';

            sidebar.innerHTML = tag;
            fisrtCheck = false;
        }
        else{
            familyTag = '<details><summary>' + filename + '</summary>';
            tag = familyTag + bufTag + '</details>';
            sidebar.innerHTML = tag.concat(sidebar.innerHTML);
        }
        
        bufTag = "";

    }
    else{
        bufTag += '<li id="item ' + htmlCounter + '" onclick="openfile(' + htmlCounter 
        + ')"  oncontextmenu="fileContextMenu(' + htmlCounter + ')">' + filename + '</li>'
    }
    htmlCounter++;
}
