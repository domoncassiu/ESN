import request from 'supertest';
import jsonwebtoken from 'jsonwebtoken';
import secrets from '../../secrets.js';
import SafetyStatusEnum from '../../models/SafetyStatusEnum.js';
import app from '../../app.js';
import http from 'http';
import State from '../../bin/State.js';
import TestDBClient from '../../clients/TestDBClient.js';
import Image from '../../models/Image.js';
import ModeEnum from '../../bin/ModeEnum.js';
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
  //   await State.activateMode(ModeEnum.TEST);
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

  await new Image(
    TestDBClient.getInstance(),
    'testimg.png',
    'mary',
    'someurl.com',
    'test',
    Date.now(),
  ).insertThisImage();
});

afterAll(async () => {
  let req = request(app)
    .post('/speedtests')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);
  let body = {
    test: 'STOP',
  };
  await req.send(body).expect(200);
  await new Image(
    TestDBClient.getInstance(),
    'testimg.png',
    'mary',
    'someurl.com',
    'test',
    Date.now(),
  ).deleteThisImage();
  await TestDBClient.getInstance().close();
  await server.close();
});

test('Can add comment: nominal: Expect201AndCommentAdded', async () => {
  const imageId = 'testimg.png';

  let req = request(app)
    .post(`/comments/test/${imageId}`)
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);

  let body = { comment: 'New comment' };
  await req.send(body).expect(201);

  let readReq = request(app)
    .get(`/comments/${imageId}`)
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);

  let response = await readReq;
  expect(response.statusCode).toBe(200);
  expect(response.body[0].imageId).toBe(imageId);
});

test('Cannot add comment: image doesnt exist_ Expect404', async () => {
  const badImageId = 'badImgId';

  let req = request(app)
    .post(`/comments/test/${badImageId}`)
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);

  let body = { comment: 'New comment' };
  await req.send(body).expect(404);
});

test('Can Get Comment; NoCommentForImageYet_200', async () => {
  const imagePoster = 'Mary';
  const imageAlbum = 'test';
  const imageId = 'nocommentimg.png';

  let req = request(app)
    .get(`/comments/${imageId}`)
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);

  let response = await req;

  // Assert the response
  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual([]);
});

test('Delet All Comments for Image: ImageExists_Expect204_DeletionWorks', async () => {
  const imageId = 'testimg.png';

  let req = request(app)
    .delete(`/comments/${imageId}`)
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);

  await req.expect(204);

  let readReq = request(app)
    .get(`/comments/${imageId}`)
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);

  let response = await readReq;
  expect(response.statusCode).toBe(200);
  expect(response.body).toStrictEqual([]);
});
