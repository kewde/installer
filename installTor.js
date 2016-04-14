var remote = require('remote');

dialog = remote.require('dialog');
function showMessage2(title, message){
	dialog.showErrorBox(title, message);
}

function setTor(){
	var tor = document.forms["tor"].elements["tor-checkbox"].checked;
	if(tor == true){
		console.log("tor on");
		remote.getGlobal("configuration").tor = true;
	} 
}
