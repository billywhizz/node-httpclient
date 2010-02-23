var sys = require("sys");
var httpcli = require("./lib/httpclient");

var url = "http://www.betdaq.com";
var surl = "https://www.betdaq.com";

function verifyTLS(request) {
	sys.puts(sys.inspect(request));
	return true;
}

var client = new httpcli.httpclient();	

// a simple http request with default options (gzip off, keepalive off, https off)
client.perform(url, "GET", function(result) {
	sys.puts(sys.inspect(result));
});

var client2 = new httpcli.httpclient();

// nested calls with gzip compression and keep-alive
client2.perform(url, "GET", function(result) {
	sys.puts(sys.inspect(result));
	client2.perform(url, "GET", function(result) {
		sys.puts(sys.inspect(result));
		// https request with callback handling of certificate validation
		client2.perform(surl, "GET", function(result) {
			sys.puts(sys.inspect(result));
		}, null, {"Accept-Encoding" : "none,gzip", "Connection" : "close"}, verifyTLS);
	}, null, {"Accept-Encoding" : "none,gzip", "Connection" : "Keep-Alive"});
}, null, {"Accept-Encoding" : "none,gzip", "Connection" : "Keep-Alive"});
