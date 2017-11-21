var mime = require('mime');

function getRawHeaderNames(rawHeaders) {
  var rawHeaderNames = {};
  for (var i = 0, len = rawHeaders.length; i < len; i += 2) {
    var name = rawHeaders[i];
    if (typeof name === 'string') {
      rawHeaderNames[name.toLowerCase()] = name;
    }
  }
  return rawHeaderNames;
}

exports.getRawHeaderNames = getRawHeaderNames;

function formatHeaders(headers, rawHeaders) {
  if (!rawHeaders) {
    return headers;
  }
  var newHeaders = {};
  if (Array.isArray(rawHeaders)) {
    var rawHeadersMap = {};
    for (var i = 0, len = rawHeaders.length; i < len; i += 2) {
      var name = rawHeaders[i];
      if (typeof name === 'string') {
        rawHeadersMap[name.toLowerCase()] = name;
      }
    }
    rawHeaders = rawHeadersMap;
  }
  Object.keys(headers).forEach(function(name) {
    newHeaders[rawHeaders[name] || name] = headers[name];
  });
  return newHeaders;
}

exports.formatHeaders = formatHeaders;

function toBuffer(str) {
  return new Buffer(str);
}

function toMultipart(name, value) {
  if (value == null) {
    value = '';
  }
  if (typeof value == 'object') {
    var filename = value.filename || value.name;
    filename = filename == null ? '' : filename + '';
    value = value.content || value.value || '';
    return toBuffer('Content-Disposition: form-data; name="' + name + '"; filename="' + filename
      + '"\r\nContent-Type: ' + mime.lookup(filename) + '\r\n\r\n' + value);
  }
  return toBuffer('Content-Disposition: form-data; name="' + name + '"\r\n\r\n' + value);
}

exports.toMultipart = toMultipart;

function toMultiparts(params, boundary) {
  var content = Object.keys(params).map(function(name) {
    return boundary + '\r\n' + toMultipart(name, params[name]);
  }).join('\r\n');
  return toBuffer(content ? '\r\n' + content : '');
}

exports.toMultiparts = toMultiparts;

exports.indexOfList = function(buf, subBuf, start) {
  start = start || 0;
  if (buf.indexOf) {
    return buf.indexOf(subBuf, start);
  }

  var subLen = subBuf.length;
  if (subLen) {
    for (var i = start, len = buf.length - subLen; i <= len; i++) {
      var j = 0;
      for (; j < subLen; j++) {
        if (subBuf[j] !== buf[i + j]) {
          break;
        }
      }
      if (j == subLen) {
        return i;
      }
    }
  }

  return -1;
};
