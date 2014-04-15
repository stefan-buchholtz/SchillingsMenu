var sprintfJs = require('sprintf-js');

module.exports = function(prodId, events) {
	var ical = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:' + prodId + '\n';
	ical = ical + events.map(function(event) {
		var s = 'BEGIN:VEVENT\n';
		if ( event.uid ) {
			s = s + 'UID:' + event.uid + '\n';
		}
		if ( event.summary ) {
			s = s + getICalString('SUMMARY:' + event.summary) + '\n';
		}
		if ( event.description ) {
			s = s + getICalString('DESCRIPTION:' + event.description) + '\n';
		}
		s = s + 'DTSTAMP:' + getDateString(event.startDate) + '\n';
		s = s + 'DTSTART:' + getDateString(event.startDate) + '\n';
		s = s + 'DTEND:' + getDateString(event.endDate) + '\n';
		s = s + 'END:VEVENT\n';
		return s;
	}).join('');
	ical = ical + 'END:VCALENDAR\n';
	return ical;
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

function getICalString(s) {
	s = s.replace('\n', '\\n', 'g');
	var lines = [];
	for (var i = 0; i < s.length; i += 75) {
		lines.push(s.substr(i, 75));
	}
	return lines.join('\n ');
}