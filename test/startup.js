let chai = require('chai');

chai.use(require('chai-http'));
chai.use(require('chai-spies'));

global.expect = chai.expect;
global.spy = chai.spy;
