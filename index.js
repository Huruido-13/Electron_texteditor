const { app, Menu, BrowserWindow } = require('electron');
const path = require('path');
var fontSize = 24;

function createWindow(){
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            nodeIntegration:true,
            enableRemoteModule: true,
            contextIsolation: false,
            defaultFontFamily:{
                defaultFontSize:24
            },
            preload:path.join(app.getAppPath(), 'preload.js')
        }
    });
    win.loadFile('index.html');
    win.webContents.openDevTools();
    return win.id;
}

function createMenu(){
    let menu_temp = [
        {
            label:'File',
            submenu:[
                {label:'New Window',click: ()=>{
                    createWindow();
                }},
                {label:'Open Folder',click: () =>{
                    openfolder();
                }},
                {label:'Create File',click: () =>{
                    createfile();
                }},
                {label:'Create Directory',click: () =>{
                    createdirectory();
                }},
                {label:'Print to PDF',click:() =>{
                    PrintToPDF();
                }},
                {label:"PDF Viewer",click:() =>{
                    viewPDF();
                }},
                {role:'close'},
                {type:'separator'},
                {role:'quit'},
        ]},
        {role:'editMenu'},
        {label:"Theme",
    submenu:[
        {label:'textmate',click: ()=>{
            setTheme('textmate')},
        },{label:'chrome',click: ()=>{
            setTheme('chrome')
        }},{label:'dracula',click: ()=>{
            setTheme('dracula')
        }},{label:'twilight',click: ()=>{
            setTheme('twilight')
        }},{label:'pastel on dark',click:() =>{
            setTheme('pastel_on_dark')
        }}
    ]},
    {label:'Mode',
    submenu:[
        {label:'text',click:() => {
            setMode('text')
        }},{label: 'javascript',click: () =>{
            setMode('javascript')
        }},{label: 'html', click: () =>{
            setMode('html')
        }},{label: 'python', click: () =>{
            setMode('python')
        }},{label: 'php', clicl: () =>{
            setMode('php')
        }}
    ]},
    {label:'Font',submenu:[
        {label:"ZoomIN", accelerator:'CommandOrControl+PageUp',click:() =>{
            setFontSize(++fontSize)
        }},
        {label:"ZoomOut",accelerator:'CommandOrControl+PageDown', click:() =>{
            setFontSize(--fontSize)
        }},
    ]},
    {label:"Find", submenu:[
        {label:'Find',accelerator:'COmmandOrControl+F',click:() =>{
            find();
        }},
        {label:'Find Next',accelerator:'CommandOrControl+right',click:() =>{
            findNext();
        }},
        {label:'Find Prev',accelerator:'COmmandOrControl+left', click:() =>{
            findPrev()
        }},
        {label:'Replace', click:() =>{
            replace();
        }},
        {label:'Replace Next', accelerator:'COmmandOrControl+r', click:() =>{
            replacenext();
        }},
        {label:'Repalce ALL',click:() =>{
            replaceall();
        }}
    ]},
    {label:'Terminal', click: () =>{
        openTerminal();
    }}
    ]
    let menu = Menu.buildFromTemplate(menu_temp);
    Menu.setApplicationMenu(menu);
}

function setTheme(tname){
    let w = BrowserWindow.getFocusedWindow();
    w.webContents.executeJavaScript('setTheme("'+ tname + '")')
}

function setMode(mname){
    let w = BrowserWindow.getFocusedWindow();
    w.webContents.executeJavaScript('setMode("' + mname + '")')
}

function setFontSize(fontSize){
    let w = BrowserWindow.getFocusedWindow();
    w.webContents.executeJavaScript('setFontSize(' + fontSize + ')')
}

function openfolder(){
    let w = BrowserWindow.getFocusedWindow();
    w.webContents.executeJavaScript('openfolder()');
}

function createfile(){
    let w = BrowserWindow.getFocusedWindow();
    w.webContents.executeJavaScript('createfile()');
}

function createdirectory(){
    let w = BrowserWindow.getFocusedWindow();
    w.webContents.executeJavaScript('createfile(true)');
}

function find(){
    let w = BrowserWindow.getFocusedWindow();
    w.webContents.executeJavaScript('find()');
}

function findNext(){
    let w = BrowserWindow.getFocusedWindow();
    w.webContents.executeJavaScript('findNext()');
}

function findPrev(){
    let w = BrowserWindow.getFocusedWindow();
    w.webContents.executeJavaScript('findPrev()');
}

function PrintToPDF(){
    let w = BrowserWindow.getFocusedWindow();
    w.webContents.executeJavaScript('PrintToPDF()');
}

function viewPDF(){
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            nodeIntegration:true,
            enableRemoteModule: true,
            contextIsolation: false,
            defaultFontFamily:{
                defaultFontSize:24
            },
            preload:path.join(app.getAppPath(), 'preload.js')
        }
    });
    win.setMenu(null);
    win.loadFile('./PDFVIEWER/pdfviewer.html');
    win.webContents.openDevTools();
}

function replace(){
    let w = BrowserWindow.getFocusedWindow();
    w.webContents.executeJavaScript('replace()');
}

function replacenext(){
    let w = BrowserWindow.getFocusedWindow();
    w.webContents.executeJavaScript('replacenext()');
}

function replaceall(){
    let w = BrowserWindow.getFocusedWindow();
    w.webContents.executeJavaScript('replaceall()');
}

function openTerminal(){
    let w = BrowserWindow.getFocusedWindow();
    w.webContents.executeJavaScript('openTerminal()');
}


createMenu();
app.whenReady().then(createWindow);

//アプリケーションウィンドウがすべて閉じられた時の動作
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }})



