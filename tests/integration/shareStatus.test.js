import request from 'supertest';
import jsonwebtoken from 'jsonwebtoken';
import secrets from '../../secrets.js';
import SafetyStatusEnum from '../../models/SafetyStatusEnum.js';
import app from '../../app.js';
import http from 'http';
import State from '../../bin/State.js';
import TestDBClient from '../../clients/TestDBClient.js';
/**
 * Get port from environment and store in Express.
 */

let port = 0;
app.set('port', port);

let server = http.createServer(app);

const token = jsonwebtoken.sign(
  { username: 'Mary', _id: '66258e517b4e1689ff74117d', type: 'Admin' },
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

test('Can add user status', async () => {
  const newStatus = SafetyStatusEnum.OK;

  let req = request(app)
    .put('/users/status')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);
  await req.send({ status: newStatus }).expect(204);
});

test('Can get existing user status', async () => {
  let req = request(app)
    .get('/users/status')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);
  await req
    .send()
    .expect(200)
    .then((response) => {
      expect(response.body).toBe(SafetyStatusEnum.OK);
    });
});
