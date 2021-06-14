const { remote } = require('electron');
const { dialog, BrowserWindow, Menu} = remote;
const path = require('path');
const fs = require('fs');

window.remote = remote;
window.BrowserWindow = BrowserWindow;
window.Menu = Menu;
window.dialog = dialog;
window.path = path;
window.fs = fs;
