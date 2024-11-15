var util = require('./lib/util');
var parse = require('./lib/parse');

exports.getRawHeaderNames = util.getRawHeaderNames;
exports.formatHeaders = util.formatHeaders;
exports.parse = parse;
exports.getRawHeaders = parse.getRawHeaders;
