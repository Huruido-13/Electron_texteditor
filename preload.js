const { remote } = require('electron');
const { dialog, BrowserWindow } = remote;
const path = require('path');
const fs = require('fs');

window.remote = remote;
window.BrowserWindow = BrowserWindow;
window.dialog = dialog;
window.path = path;
window.fs = fs;
