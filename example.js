var sys = require("sys");
var httpcli = require("./lib/httpclient");

var url = "http://www.betdaq.com/UI/Default.aspx";
var surl = "https://www.betdaq.com/UI/Default.aspx";

function verifyTLS(request) {
	sys.puts(sys.inspect(request, true, 10));
	return true;
}

var client = new httpcli.httpclient();	

// a simple http request with default options (gzip off, keepalive off, https off)
client.perform(url, "GET", function(result) {
	sys.puts(sys.inspect(result, true, 10));
});

var client2 = new httpcli.httpclient();

// nested calls with gzip compression and keep-alive
client2.perform(url, "GET", function(result) {
	sys.puts(sys.inspect(result, true, 10));
	client2.perform(url, "GET", function(result) {
		sys.puts(sys.inspect(result, true, 10));
		// https request with callback handling of certificate validation
		client2.perform(surl, "GET", function(result) {
			sys.puts(sys.inspect(result, true, 10));
		}, null, {"Accept-Encoding" : "none,gzip", "Connection" : "close"}, verifyTLS);
	}, null, {"Accept-Encoding" : "none,gzip", "Connection" : "Keep-Alive"});
}, null, {"Accept-Encoding" : "none,gzip", "Connection" : "Keep-Alive"});
