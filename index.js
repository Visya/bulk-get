var _ = require('lodash');
var fetch = require('request');
var jsonStream = require('JSONStream');
var path = require('path');
var pi = require('pipe-iterators');

module.exports = (request, response, next) => {
  if (_.isEmpty(request.query)) {
    return next();
  }

  let streams = _.map(request.query, jsonGetterFor(request, next));
  let keys = _.keys(request.query);
  
  response.set('Content-Type', 'application/json');
  response.on('error', next);

  pi.merge(streams)
  .pipe(pi.reduce((result, item) => _.extend(result, item)))
  .pipe(jsonStream.stringify(false))
  .pipe(response);
}

function fullPathFor(request, url) {
  return 'http://' + path.normalize(request.headers.host + '/' + url);
} 

function jsonGetterFor(request, next) {
  return (url, key) => fetch.get(fullPathFor(request, url))
	  .on('error', next)
	  .pipe(jsonStream.parse().on('error', next));
}
