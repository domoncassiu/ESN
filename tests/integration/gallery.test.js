import request from 'supertest';
import jsonwebtoken from 'jsonwebtoken';
import secrets from '../../secrets.js';
import app from '../../app.js';
import http from 'http';
import State from '../../bin/State.js';
import TestDBClient from '../../clients/TestDBClient.js';
import fs from 'fs';
import Image from '../../models/Image.js';
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

  await new Image(
    TestDBClient.getInstance(),
    'testimg2.png',
    '66258e517b4e1689ff74117d',
    'someurl.com',
    'test',
    Date.now(),
  ).insertThisImage();
});

let uploadedImageId;
test('Can add image: AlbumChecksOut_NominalCase_Expect201AndAdded', async () => {
  const imagePath = 'test.jpg';

  // Read the image file
  const imageBufferOrPath = fs.readFileSync(imagePath);
  const fileObject = {
    buffer: imageBufferOrPath,
    originalname: 'test.jpg', // Specify the original file name
    mimetype: 'image/png', // Specify the mimetype of the file
  };

  // Create FormData object
  const formData = new FormData();
  formData.append('images', fileObject);

  let req = request(app)
    .post('/galleries/test')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie)
    .attach('images', fileObject.buffer, {
      filename: fileObject.originalname,
      mimetype: fileObject.mimetype,
    });

  let postResponse = await req.expect(201);
  uploadedImageId = postResponse.body.imageIdArr[0];

  let readReq = request(app)
    .get(`/galleries/test/${uploadedImageId}`)
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);

  let response = await readReq;

  // Assert the response
  expect(response.statusCode).toBe(200);
  expect(response.body.imageId).toBe(uploadedImageId);
});

test('Can get single image: ImageExist_Expect200AndImage', async () => {
  const imagePoster = 'Mary';
  const imageAlbum = 'test';
  const imageId = 'testimg2.png';

  let req = request(app)
    .get(`/galleries/test/${imageId}`)
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);

  let response = await req;

  // Assert the response
  expect(response.status).toBe(200);
  expect(response.body.poster).toBe(imagePoster);
});

test('Cannot get image; DoesNotExistInDB_Expect404', async () => {
  const imagePoster = 'Mary';
  const imageAlbum = 'test';
  const imageId = 'badImage.png';

  let req = request(app)
    .get(`/galleries/test/${imageId}`)
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);

  let response = await req;

  // Assert the response
  expect(response.status).toBe(404);
});

// test('Cannot Delete image: ImageOwnerNotRequester_Expect400', async () => {
//   let albumName = 'test';
//   let imageId = 'testimg.png';
//   const badToken = jsonwebtoken.sign(
//     { username: 'joe', type: 'Admin' },
//     secrets.tokenSigningSecret,
//     { expiresIn: '1h' },
//   );
//   let req = request(app)
//     .delete(`/galleries/${albumName}/${imageId}`)
//     .set('Authorization', `Bearer ${badToken}`)
//     .set('cookie', sessionCookie);

//   await req.expect(400);
// });

// test('Can Delete image: ImageOwnerAndIsImageOwner_Expect204', async () => {
//   let albumName = 'test';
//   let req = request(app)
//     .delete(`/galleries/${albumName}/${uploadedImageId}`)
//     .set('Authorization', `Bearer ${token}`)
//     .set('cookie', sessionCookie);

//   await req.expect(204);
//   let readReq = request(app)
//     .get(`/galleries/test/${uploadedImageId}`)
//     .set('Authorization', `Bearer ${token}`)
//     .set('cookie', sessionCookie);

//   let response = await readReq;

//   // Should be delete already so Not Found
//   expect(response.statusCode).toBe(404);
// });

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
    'testimg2.png',
    'josh',
    'someurl.com',
    'test',
    Date.now(),
  ).deleteThisImage();
  await TestDBClient.getInstance().close();
  await server.close();
});
