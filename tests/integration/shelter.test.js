import request from 'supertest';
import jsonwebtoken from 'jsonwebtoken';
import secrets from '../../secrets.js';
import app from '../../app.js';
import http from 'http';
import State from '../../bin/State.js';
import TestDBClient from '../../clients/TestDBClient.js';
/**
 * Get port from environment and store in Express.
 */

let port = 0;
let reviewId = '';
app.set('port', port);

let server = http.createServer(app);

const token = jsonwebtoken.sign(
  { username: 'Steven', _id: 2, type: 'Admin' },
  secrets.tokenSigningSecret,
  { expiresIn: '1h' },
);

let sessionCookie = null;

beforeAll(async () => {
  // await State.activateMode(ModeEnum.TEST);
  await server.listen(port);
  await TestDBClient.getInstance().connect();
  await State.getInstance().setServer(server);

  let req = request(app)
    .post('/speedtests')
    .set('Authorization', `Bearer ${token}`);
  let body = {
    testDuration: 1000,
    testInterval: 10,
    test: 'START',
  };
  let response = await req.send(body).expect(200);

  sessionCookie = response.headers['set-cookie'];
  expect(response.get('Set-Cookie')).toBeDefined();
});

beforeEach(async () => {});

afterEach(async () => {});

afterAll(async () => {
  let req = request(app)
    .post('/speedtests')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);
  let body = {
    test: 'STOP',
  };
  await req.send(body).expect(200);
  await TestDBClient.getInstance().close();
  await server.close();
});

test('Can add new shelter', async () => {
  const name = 'test';
  const name2 = 'test2';
  const address = 'test address';
  const capacity = 5;
  const longitude = 5;
  const latitude = 5;

  let req = request(app)
    .post('/shelters')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);

  const response = await req
    .send({
      name: name,
      address: address,
      capacity: capacity,
      longitude: longitude,
      latitude: latitude,
    })
    .expect(201);

  const response2 = await req
    .send({
      name: name2,
      address: address,
      capacity: capacity,
      longitude: longitude,
      latitude: latitude,
    })
    .expect(201);
  reviewId = response.body._id;
});

test('Can throw error when new shelter is incorrectly constructed', async () => {
  let req = request(app)
    .post('/shelters')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);
  await req.send().expect(500);
});

test('Can get all shelters', async () => {
  let req = request(app)
    .get('/shelters')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);
  await req
    .send()
    .expect(200)
    .then((response) => {
      expect(response.body).toBeDefined();
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });
});

test('Can filter out specific shelters', async () => {
  let req = request(app)
    .get('/shelters')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie)
    .query({ name: 'test' });
  await req
    .send()
    .expect(200)
    .then((response) => {
      expect(response.body).toBeDefined();
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });
});

test('filter when nothing giving as specific shelters', async () => {
  let req = request(app)
    .get('/shelters')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie)
    .query({ name: 'test123' });
  await req
    .send()
    .expect(200)
    .then((response) => {
      expect(response.body).toBeDefined();
      expect(response.body) == {};
    });
});

test('Can edit a shelter', async () => {
  let req = request(app)
    .put('/shelters')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);

  await req
    .send({
      name: 'test',
      address: 'test address',
      capacity: 23,
      longitude: 5,
      latitude: 5,
    })
    .expect(204)
    .then((response) => {
      console.log(response.body);
      expect(response.body).toBeDefined();
    });
});

test('Can edit multiple field of a shelter', async () => {
  let req = request(app)
    .put('/shelters')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);

  await req
    .send({ name: 'test', capacity: 23, latitude: 5 })
    .expect(204)
    .then((response) => {
      console.log(response.body);
      expect(response.body).toBeDefined();
    });
});

test('cannot delete a shelter when wrong name is given', async () => {
  let req = request(app)
    .delete('/shelters')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);

  await req
    .send({ name: 'curr' })
    .expect(500)
    .then((response) => {
      console.log(response.body);
      expect(response.body).toBeDefined();
    });
});
