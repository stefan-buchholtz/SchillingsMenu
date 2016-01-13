var sprintfJs = require('sprintf-js');

var ESCAPES = {
    '\\': '\\\\',
    '\n': '\\n',
    ',': '\\,',
    ';': '\\;'
}

module.exports = function(prodId, events) {
	var ical = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:' + prodId + '\n';
	ical = ical + events.map(function(event) {
		var s = 'BEGIN:VEVENT\n';
		if ( event.uid ) {
			s = s + getICalString('UID', event.uid) + '\n';
		}
		if ( event.summary ) {
			s = s + getICalString('SUMMARY', event.summary) + '\n';
		}
		if ( event.description ) {
			s = s + getICalString('DESCRIPTION', event.description) + '\n';
		}
		s = s + 'DTSTAMP:' + getDateString(event.startDate) + '\n';
		s = s + 'DTSTART:' + getDateString(event.startDate) + '\n';
		s = s + 'DTEND:' + getDateString(event.endDate) + '\n';
		if (event.contact) {
			s = s + getICalString('CONTACT', event.contact) + '\n';
		}
		if (event.url) {
			s = s + getICalString('URL', event.url) + '\n';
		}
		s = s + 'END:VEVENT\n';
		return s;
	}).join('');
	ical = ical + 'END:VCALENDAR\n';
	return ical.replace(/\n/g, '\r\n');
}

function getDateString(date) {
	return sprintfJs.sprintf('%04d%02d%02dT%02d%02d%02dZ', 
		date.getUTCFullYear(), 
		date.getUTCMonth() + 1, 
		date.getUTCDate(), 
		date.getUTCHours(), 
		date.getUTCMinutes(), 
		date.getUTCSeconds());
}

function getICalString(key, value) {
    value = value.split('').map(function(c) {
	return ESCAPES[c] || c;
    }).join('');

    var line = key + ':' + value;
    var lines = [];
    for (var i = 0; i < line.length; i += 75) {
	lines.push(line.substr(i, 75));
    }
    return lines.join('\n ');
}
