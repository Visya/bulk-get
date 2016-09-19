let express = require('express');
let _ = require('lodash');

module.exports = (options) => {
  let app = express();  
  
  if (options.middleware) {
    app.get('/', (req, res) => options.middleware(req, res, (error) => {
      options.next(error);
      res.end();
    }));
  }
  
  if (_.has(options, 'routes')) {
    _.each(options.routes, (valueOrFn, route) => {
      let handler = _.isFunction(valueOrFn) ? valueOrFn : (req, res) => {
        let response = _.fromPairs([ [ route, valueOrFn ] ]);
        res.json(response)
      };      
      
      app.get('/' + route, handler);
    });  
  }
  
  if (options.errorHandler) {
    app.use((err, req, res, next) => {
      options.errorHandler(err, req, res, next);
      res.end();
    });
  }
  
  return app.listen(3000, _.noop);
}