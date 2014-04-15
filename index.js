var http = require('http');
var url = require('url');
var fetchMenu = require('./fetchMenu.js');

var server = http.createServer(function(request, response) {
	var urlComponents = url.parse(request.url);
	console.log(request.url);
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
		response.end();
	}
});
server.listen(8080);
