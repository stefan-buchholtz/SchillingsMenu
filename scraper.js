var cheerio = require('cheerio');

var dateSearch = /(\d\d)\.(\d\d)\.(\d\d\d\d)/;

function parseTable($, table) {
	var lines = [];
	$('tr', table).each(function() {
		var idx = lines.length;
		$('td', this).each(function() {
			var subIdx = 0;
			$(this).contents().each(function() {
				if ( $(this).is('br') ) {
					subIdx++;
				} else {
					var cellText = $(this).text().trim();
					if ( cellText ) {
						if ( lines[idx + subIdx] ) {
							lines[idx + subIdx] = lines[idx + subIdx] + ' ' + cellText;
						} else {
							lines[idx + subIdx] = cellText;
						}
					}
				}
			});
		});
	});
	return lines;
}

function extractMenus(lines) {
	var weekMenus = [];
	var currentMenu;
	lines.forEach(function(line) {
		var dateSearchResult = dateSearch.exec(line);
		if ( dateSearchResult ) {
			var date = new Date(dateSearchResult[3], dateSearchResult[2]-1, dateSearchResult[1], 0, 0, 0);
			currentMenu = { date: date, dishes: [] };
			weekMenus.push(currentMenu);
		} else if ( currentMenu ) {
			currentMenu.dishes.push(line);
		}
	});
	return weekMenus;
}

module.exports = function(html) {
	var $ = cheerio.load(html);
	var lines = parseTable($, $("table[style*='karte.gif']")).slice(1);
	return extractMenus(lines);
}