const { remote } = require('electron');
const { dialog, BrowserWindow, Menu, app} = remote;
const path = require('path');
const fs = require('fs');

window.remote = remote;
window.BrowserWindow = BrowserWindow;
window.Menu = Menu;
window.dialog = dialog;
window.path = path;
window.fs = fs;
window.app = app;
window.pdfview = pdfview;
