var remote = require('remote');
var shttps = require('socks5-https-client');
const https = require('https');
var unzip = require("unzip");

var request = require('request');
var fs      = require('fs');

var config = remote.getGlobal("configuration");
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
	//downloadFileHTTPS("https://github.com/shadowproject/shadow/releases/download/v1.4.0.3/shadow_1.4.0.3_linux64.zip", "shadow.zip", config.tor, config.path_exe);
} else if(config.os == "win32" && config.arch == "x32"){
} else if(config.os == "win32" && config.arch == "x64"){
//	downloadFileHTTPS("https://github.com/shadowproject/shadow/releases/download/v1.4.0.3/shadow_1.4.0.3_win64.zip", "shadow.zip", config.tor, config.path_exe);
} else if(config.os == "osx"){
}

//fs.createReadStream(config.path_exe +'/shadow.zip').pipe(unzip.Extract({ path: config.path_exe + '/Shadow' }));

if(config.blockchain){
	//downloadFileHTTPS("https://github.com/shadowproject/blockchain/releases/download/latest/blockchain.zip", "blockchain.zip", config.tor, config.path_block);
	//fs.createReadStream(config.path_block +'/blockchain.zip').pipe(unzip.Extract({ path: config.path_block + '/ShadowCoin' }));
}



//TODO: install icons



function downloadFileHTTPS(url2, name, proxy, path, end_path){
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
					fs.createReadStream(path +'/' + name).pipe(unzip.Extract({ path: end_path }));
          });
});

} else {
	https.get(options, function(res) {
    res.on('data', function(d) {
         file.write(d);
    }).on('end', function(){
          file.end();
					fs.createReadStream(path +'/' + name).pipe(unzip.Extract({ path: end_path }));
          });
});

}
}
