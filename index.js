var http = require('http');
var url = require('url');
var fetchMenu = require('./fetchMenu.js');

var port = process.env.PORT || 8080;

var server = http.createServer(function(request, response) {
	var urlComponents = url.parse(request.url);
	if ( urlComponents.pathname === '/schillings.ics' ) {
		fetchMenu(function(err, icalData) {
			response.writeHead(200, {
				'Content-Length': icalData.length,
				'Content-Type': 'text/calendar'
			});
			response.end(icalData);
		});
	} else {
		response.statusCode = 404;
		response.end(urlComponents.pathname + ' not found');
	}
});

server.listen(port);
console.log('server launched on port ' + port);
