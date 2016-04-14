/* form.onload
check OS -> set normal paths if none set

form.onsubmit
download
*/
var remote = require('remote');
var dialog = remote.require('dialog');


function showMessage2(title, message){
	dialog.showErrorBox(title, message);
}

function setFolders(){
	var folderexec = document.forms["folders"].elements["executable"].files[0]; //executable input element
	var folderblock = document.forms["folders"].elements["blockchain"].files[0];

//FETCH EXECUTABLE PATH AND ELSE GENERAL
	if(folderexec != null){
		remote.getGlobal("configuration").path_exe = folderexec.path; //grabs path of file input element named executable
	} else {
		//TODO: Windows Program files support.
		if(remote.getGlobal("configuration").os == "linux"){
			var userName = process.env['USER'];
			remote.getGlobal("configuration").path_exe = "/home/" + userName;
		}
		if(remote.getGlobal("configuration").os == "win32" && remote.getGlobal("configuration").arch == "x64"){
			var programfiles64 = process.env['PROGRAMFILES'];
			remote.getGlobal("configuration").path_exe = programfiles64;
		} else if(remote.getGlobal("configuration").os == "win32" && remote.getGlobal("configuration").arch == "x32") {
			var programfiles32 = process.env['PROGRAMFILES'];
			remote.getGlobal("configuration").path_exe = programfiles32;
		}

	} if (folderblock != null){
		remote.getGlobal("configuration").path_block = folderblock.path;
	} else { //nothing specified : general settings
		var userName;
		if(process.env['USER'] != null){
			userName = process.env['USER'];
		}
		remote.getGlobal("configuration").path_block = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Application Support' : "/home/" + userName);
	}
		showMessage2("Default exe", remote.getGlobal("configuration").path_exe);
		showMessage2("Default block", remote.getGlobal("configuration").path_block);
}
