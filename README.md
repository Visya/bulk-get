# bulk-get
[![Build Status](https://travis-ci.org/Visya/bulk-get.svg?branch=master)](https://travis-ci.org/Visya/bulk-get.svg?branch=master)

A simple Express.js middleware for getting multiple JSON API resources in one go.

## How to use
This middleware assumes that endpoints follow REST API best practices and have wrapper object:
```json
/users

{ "users": [] }

/users/:userId

{ "user": {} }
```

## Example app
```js
const bodyParser = require('body-parser');
const express = require('express');

const app = express();

const bulkGet = require('./index.js');

app.set('json spaces', 4);

app.use(bodyParser.json());

app.get('/', bulkGet, (req, res) => res.send('finished'));

app.get('/users', (req, res) => {
  res.send({ users: [] });
});

app.get('/countries', (req, res) => {
  res.send({ countries: [ { name: 'Netherlands' } ] });
});

app.use((error, req, res, next) => {
	console.log('Error occured!', error);
	res.sendStatus(500);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
```
Example request:
```json
http://10.47.108.225:3000/?users=/users&countries=/countries

{
  "users":[],
  "countries": [
    { "name":"Netherlands" }
  ]
}
