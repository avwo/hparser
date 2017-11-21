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
