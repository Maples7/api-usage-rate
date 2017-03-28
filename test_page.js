const path = require('path');
const express = require('express');
const request = require('supertest');
const routes = require('express-mount-routes');
const apiRate = new (require('./index.js'))();

const app = express();
app.use(apiRate.record());
routes(app, path.join(__dirname, 'controllers'));
apiRate.mouteRoutes(app);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');

  setInterval(() => {
    const id = ~~(Math.random() * 50);
    console.log(id);
    request('http://localhost:3000').get(`/tests/${id}`).then(res => console.log(res.text));
  }, 3000);
});
