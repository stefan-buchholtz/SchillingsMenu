var http = require('http');
var concatStream = require('concat-stream');
var scraper = require('./scraper.js');
var iCalendar = require('./iCalendar.js');

var URL = 'http://metzgerei-schillings.de/wochenkarte.htm';
var CONTACT = 'Metzgerei Schillings\, 02182-5690';

module.exports = function(callback) {
	http.get(URL, function(response) {
	    var concat = concatStream({ encoding: 'string' }, function(html) {
			var events = scraper(html).map(function(menu) {
				var startDate = new Date(menu.date);
				startDate.setHours(12);
				var endDate = new Date(menu.date);
				endDate.setHours(14);
				return {
					uid: startDate.getTime().toString() + '@metzgerei-schillings.de',
					startDate: startDate,
					endDate: endDate,
					summary: menu.dishes.join(' / '),
					url: URL,
					contact: CONTACT
				}
			});
			var ical = iCalendar('//Stefan Buchholtz//Metzgerei Schillings Wochenkarte//DE', events);
			callback(null, ical);
	    });
	    response.pipe(concat);
	}).on('error', function(err) {
		callback(err);
	});	
}
