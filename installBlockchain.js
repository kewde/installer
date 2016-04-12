var remote = require('remote');

dialog = remote.require('dialog');

function showMessage2(title, message){
	dialog.showErrorBox(title, message);
}

function setBlockchain(){
	var blockchain = document.forms["blockchain"].elements["blockchain-checkbox"].value;
	if(blockchain == "on"){
		remote.getGlobal("configuration").blockchain = true;
	}
}
