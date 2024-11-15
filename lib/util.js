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
    newHeaders[(rawHeaders[name] || name).trim()] = headers[name];
  });
  return newHeaders;
}

exports.formatHeaders = formatHeaders;

exports.toBuffer = function(str) {
  return Buffer.from ? Buffer.from(str) : new Buffer(str);
};

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
