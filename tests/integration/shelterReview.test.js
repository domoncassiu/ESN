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

test('Can add new review', async () => {
  const message = 'some review';
  const ratings = {
    overall: 5,
    cleanliness: 5,
    amenities: 5,
    capacity: 5,
    communication: 5,
  };
  const location = 'test location';

  let req = request(app)
    .post('/shelterReviews')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);
  const response = await req
    .send({ message: message, ratings: ratings, location: location })
    .expect(201);
  reviewId = response.body._id;
});

test('Can throw error when new review is incorrectly constructed', async () => {
  let req = request(app)
    .post('/shelterReviews')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);
  await req.send().expect(500);
});

test('Can get all reviews for a location', async () => {
  let req = request(app)
    .get('/shelterReviews/messages')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie)
    .query({ location: 'test location' });
  await req
    .send()
    .expect(200)
    .then((response) => {
      expect(response.body).toBeDefined();
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });
});

test('Can throw error when location is not defined', async () => {
  let req = request(app)
    .get('/shelterReviews/messages')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);
  await req.send().expect(500);
});

test('Can get all shelters with reviews by default', async () => {
  let req = request(app)
    .get('/shelterReviews/shelters')
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

test('Can get shelters list with conditions', async () => {
  // filterName, min, max, sortBy, ascending
  let req = request(app)
    .get('/shelterReviews/shelters')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie)
    .query({
      filterName: 'overall',
      min: '0',
      max: '5',
      sortBy: 'overall',
      ascending: 'false',
    });
  await req
    .send()
    .expect(200)
    .then((response) => {
      console.log(response.body);
      expect(response.body).toBeDefined();
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });
});

test('Can edit a review', async () => {
  let req = request(app)
    .put('/shelterReviews')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);

  await req
    .send({ id: reviewId, message: 'updatedMessage' })
    .expect(200)
    .then((response) => {
      console.log(response.body);
      expect(response.body).toBeDefined();
    });
});

test('Return unauthorized if deleting other review', async () => {
  let req = request(app)
    .delete('/shelterReviews')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);

  await req.send({ id: reviewId, reviewer: 'John' }).expect(401);
});

test('Can delete a review', async () => {
  let req = request(app)
    .delete('/shelterReviews')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);

  await req.send({ id: reviewId, reviewer: 'Mary' }).expect(200);
});
