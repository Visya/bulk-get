# bulk-get
A simple Express.js middleware for getting multiple JSON API resources in one go

# Example app
```javascript
let bodyParser = require('body-parser');
let express = require('express');

let app = express();

let bulkGet = require('./index.js');

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
