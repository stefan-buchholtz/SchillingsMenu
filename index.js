var http = require('http');
var url = require('url');
var fetchMenu = require('./fetchMenu.js');

var port = process.env.PORT || 8080;

var server = http.createServer(function(request, response) {
	console.log('request: ' + request.url);
	var urlComponents = url.parse(request.url);
	if ( urlComponents.pathname.toLowerCase() === '/schillings.ics' ) {
		fetchMenu(function(err, icalData) {
			if ( err ) {
			    response.statusCode = 500;
			    response.end(err.toString());
			    console.log('error: ' + err.toString());
			    return;
			}
			var content = new Buffer(icalData);
			response.writeHead(200, {
				'Content-Length': content.length,
				'Content-Type': 'text/calendar; charset=utf8'
			});
			response.end(content);
		});
	} else {
		response.statusCode = 404;
		response.end(urlComponents.pathname + ' not found');
	}
});

server.listen(port);
console.log('server launched on port ' + port);
