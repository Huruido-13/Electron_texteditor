const { remote } = require('electron');
const { dialog, BrowserWindow, Menu, app} = remote;
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const Encoding = require('encoding-japanese');

window.remote = remote;
window.BrowserWindow = BrowserWindow;
window.Menu = Menu;
window.dialog = dialog;
window.path = path;
window.fs = fs;
window.app = app;
window.execSync = execSync;
window.Encoding = Encoding;


window.nodeRequire = require;
delete window.module;