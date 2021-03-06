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
			s += getICalString('UID', event.uid) + '\n';
		}
		if ( event.summary ) {
			s += getICalString('SUMMARY', event.summary) + '\n';
		}
		if ( event.description ) {
			s += getICalString('DESCRIPTION', event.description) + '\n';
		}
		s += 'DTSTAMP:' + getDateString(event.startDate) + '\n';
		s += 'DTSTART:' + getDateString(event.startDate) + '\n';
		s += 'DTEND:' + getDateString(event.endDate) + '\n';
		if (event.contact) {
			s += getICalString('CONTACT', event.contact) + '\n';
		}
		if (event.organizerUri) {
			var organizerParam = 'ORGANIZER';
			if (event.organizerName) {
				organizerParam += ';CN=' + event.organizerName;
			}
			s += getICalString(organizerParam, event.organizerUri) + '\n';
		}
		if (event.url) {
			s += getICalString('URL', event.url) + '\n';
		}
		if (event.transparent) {
			s += getICalString('TRANSP', 'TRANSPARENT') + '\n';
		}
		s += 'END:VEVENT\n';
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
