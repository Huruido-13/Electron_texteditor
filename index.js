const { app, Menu, BrowserWindow } = require('electron');
const path = require('path');
const { createInflate } = require('zlib');
var fontSize = 12;

function createWindow(){
    win = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences:{
            enableRemoteModule: true,
            contextIsolation: false,
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
                {label:'New',click: ()=>{
                    createWindow();
                }},
                {label:'Open folder',click:() =>{
                    openfolder();
                }},
                {lebel:'Create File',click:() =>{
                    createfile();
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
    {label:'FontSize',submenu:[
        {label:"ZoomIN", click:() =>{
            setFontSize(++fontSize)
        }},
        {label:"ZoomOut", click:() =>{
            setFontSize(--fontSize)
        }}
    ]}
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


createMenu();
app.whenReady().then(createWindow);