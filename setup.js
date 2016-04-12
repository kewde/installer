var remote = require('remote');
var shttps = require('socks5-https-client');
const https = require('https');

var Agent = require('socks5-https-client/lib/Agent');
var request = require('request');
var fs      = require('fs');

if(remote.getGlobal("configuration").tor){
	//TODO: INSTALL TOR
}

downloadFileHTTPS("https://i.imgur.com/kq5u1Mz.png", "sdc.png", false);
//TODO: download shadow

if(remote.getGlobal("configuration").blockchain){
	//TODO: INSTALL BLOCKCHAIN
}

//TODO: install icons


function downloadFileHTTPS(url2, name, proxy){
var file = fs.createWriteStream(name);
var url = require('url');
var options = url.parse(url2);

if(proxy){
options.socksPort = 9050; // Tor default port.
shttps.get(options, function(res) {
    res.on('data', function(d) {
         file.write(d);
    });
});
} else {
	https.get(options, function(res) {
    res.on('data', function(d) {
         file.write(d);
    });
});
	
}
/*
var options = {
  uri: url,
  method: "GET",
  headers: {
    'content-type': 'application/x-www-form-urlencoded'
  },
  agentClass: Agent,
  agentOptions: {
        socksHost: 'localhost', // Defaults to 'localhost'.
        socksPort: 9050 // Defaults to 1080.
    },
  timeout: 10000,
  followRedirect: true,
  maxRedirects: 10
};


var req = request(options, function(res) {
	res.on('data', function(d) {
	  file.write(d);
  });
  
  req.end();

req.on('error', function(e) {
  console.error(e);
});
  
}); */
}