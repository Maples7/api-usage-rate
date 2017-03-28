const path = require('path');
const test = require('ava');
const express = require('express');
const routes = require('express-mount-routes');
const request = require('supertest');
const apiRate = new (require('./index.js'))();

function makeApp() {
  const app = express();
  app.use(apiRate.record());
  routes(app, path.join(__dirname, 'controllers'));
  apiRate.mouteRoutes(app);
  return app;
}

test('GET /tests/1', async (t) => {
  t.plan(4);
  const app = makeApp();
  await request(app).get('/tests/1');

  const res = await request(app).get('/api-data');

  t.is(res.status, 200);
  t.is(res.type, 'application/json');
  t.is(typeof +res.body.count, 'number');
  t.true(res.body.rank.length > 0);
});

test('POST /tests/2', async (t) => {
  t.plan(4);
  const app = makeApp();
  await request(app).post('/tests/2');

  const res = await request(app).get('/api-data');
  t.is(res.status, 200);
  t.is(res.type, 'application/json');
  t.is(typeof +res.body.count, 'number');
  t.true(res.body.rank.length > 0);
});

test('GET /tests/3', async (t) => {
  t.plan(4);
  const app = makeApp();
  await request(app).get('/tests/3');

  const res = await request(app).get('/api-data');
  t.is(res.status, 200);
  t.is(res.type, 'application/json');
  t.is(typeof +res.body.count, 'number');
  t.true(res.body.rank.length > 0);
});
