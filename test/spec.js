let chai = require('chai');
let _ = require('lodash');

let bulkGet = require('..');
let createServer = require('./server');

describe('Bulk GET middleware', () => {
  it('retrieves single resource', () => {
    let app = createServer({
      routes: { users: [] },
      middleware: bulkGet
    });
    
    return chai.request(app)
      .get('/')
      .query({ users: '/users' })
      .then((response) => {
        expect(response).to.be.json;
        expect(response.body.users).to.be.an('array').and.have.length(0);
      })
      .then(() => app.close());
  });
  
  it('retrieves multiple resources', () => {
    let app = createServer({
      routes: { users: [], countries: [ { name: 'Netherlands' } ] },
      middleware: bulkGet
    });
    
    return chai.request(app)
      .get('/')
      .query({ users: '/users', countries: '/countries' })
      .then((response) => {
        expect(response.body).to.be.an('object').and.have.keys([ 'users', 'countries' ]);
        expect(response.body.countries[0]).to.have.property('name', 'Netherlands');
      })
      .then(() => app.close());
  });
  
  describe('validation', () => {
    let next,
        app;
    
    beforeEach(() => {
      next = spy();
      app = createServer({
        middleware: bulkGet,
        next: next
      });
    });
    
    afterEach(() => {
      app.close();
    });
    
    it('passes error to the next function', () => {
      return chai.request(app)
        .get('/')
        .query({ error: '/error' })
        .then((response) => {
          expect(next).to.have.been.called();
        });  
    });
    
    it('calls next function when query is empty', () => {    
      return chai.request(app)
        .get('/')
        .then((response) => {
          expect(next).to.have.been.called();
        });
    });
    
    it('ignores query parameters without a value', () => {      
      return chai.request(app)
        .get('/')
        .query({ users: '' })
        .then((response) => {
          expect(next).to.have.been.called();
        });
    });
  });
});