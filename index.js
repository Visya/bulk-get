const _ = require('lodash');
const fetch = require('request');
const jsonStream = require('JSONStream');
const url = require('url');
const pi = require('pipe-iterators');

module.exports = (request, response, next) => {
  let query = _.pickBy(request.query, _.identity);
  
  if (_.isEmpty(query)) {
    return next();
  }

  let resources = _.map(query, jsonGetterFor(request, next));
  
  response.set('Content-Type', 'application/json');
  response.on('error', next);

  pi.merge(resources)
  .pipe(pi.reduce((result, item) => _.extend(result, item)))
  .pipe(jsonStream.stringify(false))
  .pipe(response);
}

function fullPathFor(request, path) {
  return url.format({
    protocol: request.protocol,
    host: request.headers.host,
    pathname: path
  });
} 

function jsonGetterFor(request, next) {
  return (url, key) => fetch.get(fullPathFor(request, url))
	  .on('error', next)
	  .pipe(jsonStream.parse().on('error', next));
}
