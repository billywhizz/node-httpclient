var sys = require("sys");
var httpcli = require("./lib/httpclient");
var testnum = 0;
var client = new httpcli.httpclient();	

// return false to reject the certificate
function verifyTLS(request) {
/*
	sys.puts(sys.inspect(request));
*/
	return true;
}

// reuses one http client for all requests
function runtest(url, method, data, exheaders, tlscb) {
	var mytestnum = ++testnum;
	sys.puts(mytestnum + " : " + url);
	var startTime = new Date();
	client.perform(url, method, function(result) {
		var tt = new Date().getTime() - startTime.getTime();
		sys.puts(mytestnum + " : " + result.response.status + " : " + tt);
/*
		sys.puts(sys.inspect(result));
*/
	}, data, exheaders, tlscb);
}

// creates a new client for each request
function runtest2(url, method, data, exheaders, tlscb) {
	var mytestnum = ++testnum;
	sys.puts(mytestnum + " : " + url);
	var startTime = new Date();
	var client = new httpcli.httpclient();	
	client.perform(url, method, function(result) {
		var tt = new Date().getTime() - startTime.getTime();
		sys.puts(mytestnum + " : " + result.response.status + " : " + tt);
/*
		sys.puts(sys.inspect(result));
*/
	}, data, exheaders, tlscb);
}

function runtests(url, foo) {
	foo("http://" + url, "GET", null, {"Connection" : "close"}, null);
	foo("https://" + url, "GET", null, {"Connection" : "close"}, verifyTLS);
	foo("https://" + url, "GET", null, {"Connection" : "close"});
	foo("http://" + url, "GET", null, {"Accept-Encoding" : "gzip", "Connection" : "close"}, null);
	foo("https://" + url, "GET", null, {"Accept-Encoding" : "gzip", "Connection" : "close"});
	foo("https://" + url, "GET", null, {"Accept-Encoding" : "gzip", "Connection" : "close"}, verifyTLS);
	foo("http://" + url, "GET", null, {"Connection" : "Keep-Alive"}, null);
	foo("https://" + url, "GET", null, {"Connection" : "Keep-Alive"});
	foo("https://" + url, "GET", null, {"Connection" : "Keep-Alive"}, verifyTLS);
	foo("http://" + url, "GET", null, {"Accept-Encoding" : "gzip", "Connection" : "Keep-Alive"}, null);
	foo("https://" + url, "GET", null, {"Accept-Encoding" : "gzip", "Connection" : "Keep-Alive"});
	foo("https://" + url, "GET", null, {"Accept-Encoding" : "gzip", "Connection" : "Keep-Alive"}, verifyTLS);
}

// put a domain name and path here for an address that has the features you want to test (ssl, gzip, keepalive)
// be sure to exclude the protocol
//runtests("www.google.co.uk", runtest);
runtests("mail.google.com", runtest2);
