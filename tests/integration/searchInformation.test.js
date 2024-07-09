import request from 'supertest';
import jsonwebtoken from 'jsonwebtoken';
import secrets from '../../secrets.js';
import app from '../../app.js';
import http from 'http';
import State from '../../bin/State.js';
import TestDBClient from '../../clients/TestDBClient.js';
import SafetyStatusEnum from '../../models/SafetyStatusEnum.js';
import EsnTest from '../../middleware/esntest.js';
import searchRouter from '../../routes/search.js';
import PublicMessage from '../../models/PublicMessage.js';
import PrivateMessage from '../../models/PrivateMessage.js';
import PrivateMessageReadStatusEnum from '../../models/PrivateMessageReadStatusEnum.js';
import Announcement from '../../models/Announcement.js';
import SafetyStatus from '../../models/SafetyStatus.js';
import UnauthenticatedUser from '../../models/UnauthenticatedUser.js';
import AuthenticatedUser from '../../models/AuthenticatedUser.js';
import UserType from '../../models/UserType.js';
import OnlineStatus from '../../models/OnlineStatus.js';
import OnlineStatusEnum from '../../models/OnlineStatusEnum.js';
import LoginController from '../../controllers/LoginController.js';
import UserController from '../../controllers/UserController.js';
/**
 * Get port from environment and store in Express.
 */

let port = 0;
app.set('port', port);

let server = http.createServer(app);

const token = jsonwebtoken.sign(
  { username: 'mary', _id: '66258e517b4e1689ff74117d', type: 'Admin' },
  secrets.tokenSigningSecret,
  { expiresIn: '1h' },
);

let sessionCookie = null;
let bobId = null;
let maryId = null;

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

  try {
    const loginController = new LoginController(TestDBClient.getInstance());
    const userController = new UserController(TestDBClient.getInstance());
    const bob = new UnauthenticatedUser(
      TestDBClient.getInstance(),
      'bob',
      'myAmazingPassword',
    );
    const mary = new UnauthenticatedUser(
      TestDBClient.getInstance(),
      'mary',
      'myAmazingPassword',
    );
    let citizenBob = await userController.getUserByName('bob');
    if (!citizenBob) {
      citizenBob = await loginController.addUser(bob);
    }
    let citizenMary = await userController.getUserByName('mary');
    if (!citizenMary) {
      citizenBob = await loginController.addUser(mary);
    }

    bobId = JSON.stringify(citizenBob._id).replace(/"/g, '');

    maryId = JSON.stringify(citizenMary._id).replace(/"/g, '');

    await new PublicMessage(
      TestDBClient.getInstance(),
      '12345',
      'mary',
      'Hello, World!',
      SafetyStatusEnum.OK,
      Date.now(),
    ).insertThisMessage();
    await new PrivateMessage(
      TestDBClient.getInstance(),
      '12345',
      'mary',
      'Hello, World!',
      SafetyStatusEnum.OK,
      Date.now(),
      'bob',
      PrivateMessageReadStatusEnum.READ,
    ).insertThisMessage();
    await new Announcement(
      TestDBClient.getInstance(),
      '12345',
      'mary',
      'Hello, Woild!',
      Date.now(),
    );
    await new SafetyStatus(
      TestDBClient.getInstance(),
      bobId,
      SafetyStatusEnum.OK,
      Date.now(),
    );
    await new OnlineStatus(
      TestDBClient.getInstance(),
      bobId,
      OnlineStatusEnum.ONLINE,
      Date.now(),
    );
  } catch (err) {
    // Do nothing
  }
});

test('Can search citizens', async () => {
  const usernamePart = 'mar';

  let req = request(app)
    .get('/search/citizens?keyword=' + usernamePart + '&page=1')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);
  await req.send().expect(200);
});

test('Can search user status', async () => {
  const newStatus = SafetyStatusEnum.OK;

  let req = request(app)
    .get('/search/statuses?keyword=' + newStatus)
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);
  await req.send().expect(200);
});

test('Can search public messages', async () => {
  const keyword = 'Hello';

  let req = request(app)
    .get('/search/public?keyword=' + keyword + '&page=1')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);
  await req.send().expect(200);
});

test('Can search private messages', async () => {
  const keyword = 'Hello';
  const sender = 'mary';
  const receiver = 'bob';

  let req = request(app)
    .get(
      '/search/private?keyword=' +
        keyword +
        '&page=1&sender=' +
        sender +
        '&receiver=' +
        receiver,
    )
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);
  await req.send().expect(200);
});

test('Can search announcements', async () => {
  const keyword = 'Hello';

  let req = request(app)
    .get('/search/announcements?keyword=' + keyword + '&page=1')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);
  await req.send().expect(200);
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

  await State.getInstance().websocketSubsystem.close();
  await TestDBClient.getInstance().close();
  await server.close();
});
