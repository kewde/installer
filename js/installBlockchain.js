const remote = require('electron').remote;

dialog = remote.require('dialog');

function showMessage2(title, message){
	dialog.showErrorBox(title, message);
}

function setBlockchain(){
	var blockchain = document.forms["blockchain"].elements["blockchain-checkbox"].checked;
	if(blockchain == true){
		remote.getGlobal("configuration").blockchain = true;
	}
}
