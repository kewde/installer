var remote = require('remote');
var config = remote.getGlobal("configuration");
var shttps = require('socks5-https-client');
const https = require('https');
var unzip = require("unzip");
var request = require('request');
var fs      = require('fs');
var path		= require('path');
var shell   = require('shell');

if(config.os == "win32") {
    var ws = require('windows-shortcuts');
}

console.log("Tor: " + remote.getGlobal("configuration").tor);
var torport = 9050;

if(config.tor){
	//TODO: INSTALL TOR
	if(config.os == "linux"){
		var sudo = require('sudo');
		var options = {
				cachePassword: true,
				prompt: 'Password, yo? ',
				spawnOptions: { /* other options for spawn */ }
		};
		var child = sudo([ 'apt-get', 'install', '-y', 'tor' ], options);
	} else if(config.os == "win32" && config.arch == "x32"){
		downloadFileHTTPS("https://dist.torproject.org/torbrowser/5.5.4/tor-win32-0.2.7.6.zip", "tor.zip", false, config.path_exe, config.path_exe + "/Shadow/tor"  );

		var child_process = require('child_process');

// execFile: executes a file with the specified arguments
//--service install -options -f "%torrc%\torrc"
child_process.execFile(config.path_exe + "/Shadow/tor/Tor/tor.exe", ['--service', 'install', '-options', '-f', '"' + config.path_exe + "/Shadow/tor/Data/"  +'torrc"'], function(error, stdout, stderr){
	console.log(stdout);
	});

	} else if(config.os == "win32" && config.arch == "x64"){
		downloadFileHTTPS("https://dist.torproject.org/torbrowser/5.5.4/tor-win32-0.2.7.6.zip", "tor.zip", false, config.path_exe, config.path_exe + "/Shadow/tor" );

		var conftor = "";
		conftor += "HiddenServiceDir " + config.path_exe + "/Shadow/tor/Data/shadowcash-service\n";
 		conftor += "HiddenServicePort 51738 127.0.0.1:51738\n";
		conftor += "SocksPort 127.0.0.1:9150\n";
		conftor += "ControlPort auto\n";

		var stream = fs.createWriteStream(config.path_exe + '/Shadow/tor/Data/torrc');
		stream.on('open', function(fd) {
		  stream.write("HiddenServiceDir " + config.path_exe + "/Shadow/tor/Data/shadowcash-service\n");
		  stream.write("HiddenServicePort 51738 127.0.0.1:51738\n");
			stream.write("SocksPort 127.0.0.1:9150\n");
			stream.write("ControlPort auto\n");

		}).on('close', function(fd) {
			stream.close();
		});


		//var torrc = fs.writeFileSync(config.path_exe + '/Shadow/tor/Data/torrc', conftor);


		var child_process = require('child_process');

// execFile: executes a file with the specified arguments
//--service install -options -f "%torrc%\torrc"/

child_process.execFile(config.path_exe + "/Shadow/tor/Tor/tor.exe", ['--service', 'install', '-options', 'SocksPort', '127.0.0.1:9150', 'ControlPort','auto'], function(error, stdout, stderr){
	console.log('ERROR:' + error);
	console.log(stdout);
});
/*
//option 1
child_process.execFile(config.path_exe + "/Shadow/tor/Tor/tor.exe", ['--service', 'install', '-options', 'HiddenServiceDir', config.path_exe + '/Shadow/tor/Data/shadowcash-service', 'HiddenServicePort', '51738', 'SocksPort', '127.0.0.1:9150', 'ControlPort','auto'], function(error, stdout, stderr){
	console.log(stdout);
});

//option 2
var nodewin = require('node-windows');
pathtest = config.path_exe;
nodewin.elevate('"' + pathtest + '/Shadow/tor/Tor/tor.exe" --service install -options HiddenServiceDir "C:/Users/Florian Mathieu/AppData/Local/Shadow/tor/Data/shadowcash-service" HiddenServicePort 51738 SocksPort 127.0.0.1:9150 ControlPort auto');


//option 3
	child_process.execFile(config.path_exe + "/Shadow/tor/Tor/tor.exe", ['--service', 'install', '-options', '-f', config.path_exe + '/Shadow/tor/Data/torrc'], function(error, stdout, stderr){
		console.log(stdout);
	});*/



	} else if(config.os == "osx"){
	} else {
	remote.getGlobal("configuration").tor = false;
	}

}

	//downloadFileHTTPS("https://github.com/shadowproject/shadow/releases/download/v1.4.0.3/shadow_1.4.0.3_linux64.zip", "shadow.zip", config.tor, config.path_exe);
  //downloadFileHTTPS("https://i.imgur.com/kq5u1Mz.png", "sdc.png", config.tor, config.path_exe);
if(config.os == "linux" && config.arch == "x32"){

} else if(config.os == "linux" && config.arch == "x64"){
	downloadFileHTTPS("https://doc.shadowproject.io/bins/umbra_1.5.0.4_linux64.zip", "shadow.zip", config.tor, config.path_exe, config.path_exe + '/Shadow');
} else if(config.os == "win32" && config.arch == "x32"){
	downloadFileHTTPS("https://doc.shadowproject.io/bins/umbra_1.5.0.4_win32.zip", "shadow.zip", config.tor, config.path_exe, config.path_exe + '/Shadow');
} else if(config.os == "win32" && config.arch == "x64"){
	downloadFileHTTPS("https://doc.shadowproject.io/bins/umbra_1.5.0.4_win64.zip", "shadow.zip", config.tor, config.path_exe, config.path_exe + '/Shadow');
} else if(config.os == "osx"){
	downloadFileHTTPS("https://doc.shadowproject.io/bins/umbra_1.5.0.4_macosx.dmg.zip", "shadow.zip", config.tor, config.path_exe, config.path_exe + '/Shadow');
}

//fs.createReadStream(config.path_exe +'/shadow.zip').pipe(unzip.Extract({ path: config.path_exe + '/Shadow' }));

if(config.blockchain){
	downloadFileHTTPS("https://doc.shadowproject.io/bins/blockchain.zip", "blockchain.zip", config.tor, config.path_block, config.path_block + '/ShadowCoin');
	//fs.createReadStream(config.path_block +'/blockchain.zip').pipe(unzip.Extract({ path: config.path_block + '/ShadowCoin' }));
} else {
	fs.mkdir(config.path_block + '/ShadowCoin');
}



//TODO: install icons



function downloadFileHTTPS(url2, name, proxy, path, unzip_path) {
	var file = fs.createWriteStream(path + "/" + name);
	var url = require('url');
	var options = url.parse(url2);
	options.followAllRedirects = true;
	options.followRedirect = true;
	options.maxRedirects = 10;

	if(proxy){
		options.socksPort = 9050; // Tor default port

		shttps.get(options, function(res) {
	    res.on('data', function(d) {
				console.log("called data");
        file.write(d);
	    }).on('end', function(){
        file.end();
				fs.createReadStream(path +'/' + name).pipe(unzip.Extract({ path: unzip_path }));
				fs.unlinkSync(path +'/' + name);
      });
		});
	} else {
		var len = 0;
		var downloadingUmbra = true
		https.get(options, function(res) {
	    res.on('data', function(d) {
	         file.write(d);
					 len += d.length;
				  var percent = Math.round((len / res.headers['content-length']) * 100);
					if(percent <= 100) {
						if(name == "shadow.zip") {
							console.log("Downloading " + name + ": " + percent);
							var parent = document.getElementById("umbra");
							var progress = document.getElementById("umbra-percent");
							parent.style.display = 'block';
							progress.innerHTML = percent + "% completed";
						}
						if(name == "blockchain.zip") {
							console.log("Downloading " + name + ": " + percent);
							var parent = document.getElementById("blockchain-download");
							var progress = document.getElementById("blockchain-percent");
							parent.style.display = 'block';
							progress.innerHTML = percent + "% completed";
						}
					}
					if(percent == 100 && name == "shadow.zip") {
						document.getElementById("umbra-percent").innerHTML = "✓ Downloaded"
					}
					if(percent == 100 && name == "blockchain.zip") {
						document.getElementById("blockchain-percent").innerHTML = "✓ Downloaded"
					}
	    }).on('end', function(){
	      file.end();
				fs.createReadStream(path +'/' + name).pipe(unzip.Extract({ path: unzip_path }));
				fs.unlinkSync(path +'/' + name);

				if(config.blockchain) {
					if(document.getElementById("umbra-percent").innerHTML == "✓ Downloaded" && document.getElementById("blockchain-percent").innerHTML == "✓ Downloaded") {
						document.getElementById('loading').innerHTML = "✓";
						document.getElementById('finish-btn').removeAttribute('disabled');
						document.getElementById('finish-btn').style.backgroundColor = "#E2213D";
						document.getElementById('finish-btn').setAttribute('onClick', 'launchUmbra();');
					}
				} else {
					if(document.getElementById("umbra-percent").innerHTML == "✓ Downloaded") {
						document.getElementById('loading').innerHTML = "✓";
						document.getElementById('finish-btn').removeAttribute('disabled');
						document.getElementById('finish-btn').style.backgroundColor = "#E2213D";
						document.getElementById('finish-btn').setAttribute('onClick', 'launchUmbra();');
					}
				}

				if(config.os == "linux" && config.arch == "x32"){

				} else if(config.os == "linux" && config.arch == "x64"){
					var stream = fs.createWriteStream(config.path_exe + '/Launch Umbra.desktop');
					stream.on('open', function(fd) {
						stream.write("[Desktop Entry]\n");
						stream.write("Name[en_US]=UMBRA\n");
						stream.write("GenericName=UMBRA\n");
						stream.write("Terminal=false \n");
						stream.write("Exec=" + config.path_exe + "/Shadow/umbra -datadir='" + config.path_block + "/ShadowCoin'\n");
						stream.write("Icon[en_US]=" + config.path_exe + "/logo.png\n");
						stream.write("Type=Application\n");
						stream.write("Categories=Application;Network;Security;\n");
						stream.write("Comment[en_US]=Privacy Platform\n");

					}).on('close', function(fd) {
						stream.close();
					});
				} else if(config.os == "win32" && config.arch == "x32"){
					if(name == "shadow.zip") {
						ws.create(unzip_path + "/Launch Umbra.lnk", {
					    target : unzip_path + "/umbra.exe",
					    args : '-datadir="' + config.path_block + '\\ShadowCoin' + '"',
					    desc : "Launch Umbra by The Shadow Project."
						});
					}
				} else if(config.os == "win32" && config.arch == "x64"){
					if(name == "shadow.zip") {
						ws.create(unzip_path + "/Launch Umbra.lnk", {
					    target : unzip_path + "/umbra.exe",
					    args : '-datadir="' + config.path_block + '\\ShadowCoin' + '"',
					    desc : "Launch Umbra by The Shadow Project."
						});
					}
				} else if(config.os == "osx"){

				}
      });
		});
	}
}

function launchUmbra() {
	if(config.os == "linux" && config.arch == "x32"){

	} else if(config.os == "linux" && config.arch == "x64"){
		shell.openItem(config.path_exe + "/Launch Umbra.desktop");
		var window = remote.getCurrentWindow();
		window.close();
	} else if(config.os == "win32" && config.arch == "x32"){
		shell.openItem(config.path_exe + "/Shadow/Launch Umbra.lnk");
		var window = remote.getCurrentWindow();
		window.close();
	} else if(config.os == "win32" && config.arch == "x64"){
		shell.openItem(config.path_exe + "/Shadow/Launch Umbra.lnk");
		var window = remote.getCurrentWindow();
		window.close();
	} else if(config.os == "osx"){

	}
}
