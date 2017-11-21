var util = require('./util');
var CRLF = new Buffer('\r\n');
var MAX_SIZE = 5120;
var NAME_RE = /name=(?:"([^"]+)"|([^;]+))/i;

function MultipartParser(params) {
  this._params = params;
}

function getName(firstLine) {
  return NAME_RE.test(firstLine) ? (RegExp.$1 || RegExp.$2 || '') : null;
}

var proto = MultipartParser.prototype;
proto.transform = function(chunk) {
  if (this._notMatched) {
    return chunk;
  }

  if (this._ended) {
    return;
  }

  chunk = this._buffer ? Buffer.concat([this._buffer, chunk]) : chunk;
  this._buffer = null;
  var index = util.indexOfList(chunk, CRLF);
  if (index != -1) {
    var name = getName(chunk.slice(0, index) + '');
    if (name == null || !(name in this._params)) {
      this._notMatched = true;
    } else {
      this._ended = true;
      chunk = util.toMultipart(name, this._params[name]);
      delete this._params[name];
    }
  } else if (chunk.length > MAX_SIZE) {
    this._notMatched = true;
  } else {
    this._buffer = chunk;
    chunk = null;
  }

  return chunk;
};

module.exports = MultipartParser;

