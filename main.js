'use strict';

const electron = require('electron');
const os = require('os');

var path = require('path');
var ipc = require('ipc');
var dialog = require('dialog');

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

global.configuration = {
	os: os.platform(),
	arch: os.arch(),
	tails: 0,
	path_exe: "",
	path_block: "",
	tor: false,
	blockchain: false
};


function createWindow () {

  mainWindow = new BrowserWindow({width: 800, height: 600, frame: false});
  mainWindow.loadURL('file://' + __dirname + '/intro.html');
	mainWindow.setMenu(null);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

	setDefaultPaths();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

// TODO: detect tails
function detectTails(){
	if(global.configuration.os == "linux"){
		//showMessage(process.ENV['USER']);
	} else {
		return 0;
	}
}

function setDefaultPaths(){
	if(global.configuration.os == "linux") {
		global.configuration.path = "/home";
	}
	if(global.configuration.os == "win32") {
		global.configuration.path = "C:\ProgramData";
	}
	if(global.configuration.os == "osx") {
		global.configuration.path = "~/Desktop";
	}
}

function showMessage(title, message){
	dialog.showErrorBox(title, message);
}

app.on('ready', createWindow);


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
