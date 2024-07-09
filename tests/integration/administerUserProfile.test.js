import request from 'supertest';
import jsonwebtoken from 'jsonwebtoken';
import secrets from '../../secrets.js';
import app from '../../app.js';
import http from 'http';
import State from '../../bin/State.js';
import TestDBClient from '../../clients/TestDBClient.js';
import UserType from '../../models/UserType.js';
import UserController from '../../controllers/UserController.js';
import UnauthenticatedUser from '../../models/UnauthenticatedUser.js';
import LoginController from '../../controllers/LoginController.js';
import AuthenticatedUser from '../../models/AuthenticatedUser.js';
/**
 * Get port from environment and store in Express.
 */

let port = 0;
let reviewId = '';
app.set('port', port);

let server = http.createServer(app);

const token = jsonwebtoken.sign(
  { username: 'Mary', _id: '66258e517b4e1689ff74117d', type: 'Admin' },
  secrets.tokenSigningSecret,
  { expiresIn: '1h' },
);

let sessionCookie = null;
let adminId = null;
let citizenId = null;
let adminToken = null;
let citizenToken = null;

beforeAll(async () => {
  // await State.activateMode(ModeEnum.TEST);
  await server.listen(port);
  await TestDBClient.getInstance().connect();
  await State.getInstance().setServer(server);
  const userController = new UserController(TestDBClient.getInstance());
  await userController.initializeAdmin();

  // set up citizen and admin
  const esnadmin = await userController.getUserByName('esnadmin');
  adminId = JSON.stringify(esnadmin._id).replace(/"/g, '');
  const loginController = new LoginController(TestDBClient.getInstance());
  const unauthenticatedCitizen = new UnauthenticatedUser(
    TestDBClient.getInstance(),
    'mary123',
    'test123',
  );
  let citizen = await userController.getUserByName('mary123');
  if (!citizen) {
    citizen = await loginController.addUser(unauthenticatedCitizen);
  }
  citizenId = JSON.stringify(citizen._id).replace(/"/g, '');

  // set up citizen and admin tokens
  citizenToken = jsonwebtoken.sign(
    { username: 'mary123', _id: citizenId, type: 'Citizen' },
    secrets.tokenSigningSecret,
    { expiresIn: '1h' },
  );
  adminToken = jsonwebtoken.sign(
    { username: 'esnadmin', _id: adminId, type: 'Admin' },
    secrets.tokenSigningSecret,
    { expiresIn: '1h' },
  );

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

test('Can approve a valid update', async () => {
  let req = request(app)
    .post(`/users/changes/validation/${citizenId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .set('cookie', sessionCookie);
  await req
    .send({ username: 'laura1', type: UserType.COORDINATOR })
    .expect(200);
}, 10000);

test('Can reject an update validation initiated by non-admin', async () => {
  let req = request(app)
    .post(`/users/changes/validation/${citizenId}`)
    .set('Authorization', `Bearer ${citizenToken}`)
    .set('cookie', sessionCookie);
  await req
    .send({ username: 'laura1', type: UserType.COORDINATOR })
    .expect(403);
});

test('Can reject an update based on one admin rule', async () => {
  let req = request(app)
    .post(`/users/changes/validation/${adminId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .set('cookie', sessionCookie);
  await req.send({ type: UserType.CITIZEN }).expect(403);
});

test('Can update a username', async () => {
  let req = request(app)
    .put(`/users/${citizenId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .set('cookie', sessionCookie);
  await req.send({ username: 'laura1' }).expect(204);

  const updatedUser = await AuthenticatedUser.getUserById(
    TestDBClient.getInstance(),
    citizenId,
  );
  expect(updatedUser.username).toEqual('laura1');
});

test('Can update a username back', async () => {
  let req = request(app)
    .put(`/users/${citizenId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .set('cookie', sessionCookie);
  await req.send({ username: 'mary123' }).expect(204);
  const updatedUser = await AuthenticatedUser.getUserById(
    TestDBClient.getInstance(),
    citizenId,
  );
  expect(updatedUser.username).toEqual('mary123');
});

test('Can update a user type', async () => {
  let req = request(app)
    .put(`/users/${citizenId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .set('cookie', sessionCookie);
  await req.send({ type: UserType.ADMIN }).expect(204);
  const updatedUser = await AuthenticatedUser.getUserById(
    TestDBClient.getInstance(),
    citizenId,
  );
  expect(updatedUser.type).toEqual(UserType.ADMIN);
});

test('Can update a user type back', async () => {
  let req = request(app)
    .put(`/users/${citizenId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .set('cookie', sessionCookie);
  await req.send({ type: UserType.CITIZEN }).expect(204);
  const updatedUser = await AuthenticatedUser.getUserById(
    TestDBClient.getInstance(),
    citizenId,
  );
  expect(updatedUser.type).toEqual(UserType.CITIZEN);
});

test('Can reject an update initiated by non-admin', async () => {
  let req = request(app)
    .put(`/users/${citizenId}`)
    .set('Authorization', `Bearer ${citizenToken}`)
    .set('cookie', sessionCookie);
  await req
    .send({ username: 'laura1', type: UserType.COORDINATOR })
    .expect(403);
});
