var editor = null;
var folder_path = null;
var folder_items = null
var current_fname = null;
var footer = null;
var sidebar = null;
var change_flg = false;
var filledId = null;

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
        folder_path = null;
        folder_items = null
        current_fname = null;
    });
    
    sidebar.addEventListener('drop', (event) =>{
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
        loadPath();
        footer.textContent = 'open dir:"' + folder_path + '".';
    } 
    else{
        alert("ディレクトリは開かれませんでした。")
    }
}

//ダイアログから開かれたディレクトリを読み込み、ファイルを一覧としてサイドバーに表示する
function loadPath(){
    fs.readdir(folder_path, (err, files) =>{
        if(err === null){
            folder_items = files;
            let tag = '<ul>';
            for (const n in files){
                tag += '<li id="item ' + n + '" onclick="openfile(' + n + ')"  oncontextmenu="fileContextMenu(' + n + ')">' + files[n] + '</li>'; 
            }
            tag += '</ul>';
            sidebar.innerHTML = tag;
        }
        else{
            alert(err);
        }

    })
}

//fs.readdir()から受け取ったディレクトリ内のファイルの配列からファイルを取得
function openfile(n){
    //サイドバーのファイルがクリックされた際にフラグがTRUEならファイルを保存する
    savefile();
    if(filledId !== null){
        clearBackground(filledId);
    }
    current_fname = folder_items[n];
    let fpath = path.join(folder_path, current_fname);
    fs.readFile(fpath, (err,result) =>{
        if(err === null){
            let data = result.toString();
            editor.session.getDocument().setValue(data);
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

function createfileresult(){
    current_fname = document.querySelector("#input_file_name").value;
    let fpath = path.join(folder_path, current_fname);
    fs.writeFile(fpath, '', (err) =>{
        editor.session.getDocument().setValue('');
        footer.textContent = '"' + current_fname + '" created.';
        change_flg = false;
        loadPath();
    })
}

function fileContextMenu(n){
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
}

function fillBackground(n){
    let elemId = "item " + n;
    let elem = document.getElementById(elemId);
    elem.style.background = '#808080';
}

function clearBackground(filledId){
    let elemId = "item " + filledId;
    let elem = document.getElementById(elemId);
    elem.style.background = '#505050';
}