import request from 'supertest';
import jsonwebtoken from 'jsonwebtoken';
import secrets from '../../secrets.js';
import app from '../../app.js';
import http from 'http';
import State from '../../bin/State.js';
import TestDBClient from '../../clients/TestDBClient.js';
import SafetyStatusEnum from '../../models/SafetyStatusEnum.js';
import AuthenticatedUser from '../../models/AuthenticatedUser.js';
import UserType from '../../models/UserType.js';
import GroupMessage from '../../models/GroupMessage.js';
import Sentiment from '../../models/Sentiment.js';
import { uuid } from 'uuidv4';
import Incident from '../../models/Incident.js';
import IncidentStatusEnum from '../../models/IncidentStatusEnum.js';
import { SchemaType } from 'mongoose';
/**
 * Get port from environment and store in Express.
 */

let port = 0;
app.set('port', port);

let server = http.createServer(app);

let token = null;
let incidentId = uuid();

let sessionCookie = null;
let incident = null;
let groupMessage = null;
let neumann = null;
let jillian = null;

beforeAll(async () => {
  // await State.activateMode(ModeEnum.TEST);
  await server.listen(port);
  await TestDBClient.getInstance().connect();
  await State.getInstance().setServer(server);

  try {
    neumann = await new AuthenticatedUser(
      TestDBClient.getInstance(),
      'neumann',
      'myAmazingPassword',
      UserType.CITIZEN,
      true,
      true,
      [incidentId],
    ).insertThisUser();
  } catch (err) {
    console.error(err);
  }

  try {
    jillian = await new AuthenticatedUser(
      TestDBClient.getInstance(),
      'jillian',
      'myAmazingPassword',
      UserType.CITIZEN,
      true,
      true,
    ).insertThisUser();
    console.log({
      username: jillian.username,
      _id: jillian.getUserId(),
      type: jillian.type,
    });
    token = jsonwebtoken.sign(
      {
        username: jillian.username,
        _id: jillian.getUserId(),
        type: jillian.type,
      },
      secrets.tokenSigningSecret,
      { expiresIn: '1h' },
    );
  } catch (err) {
    console.error(err);
  }

  incident = new Incident(
    TestDBClient.getInstance(),
    incidentId,
    'Integration Wildfire',
    'Integration Wildfires 2024',
    -122.0787153,
    37.4053896,
    IncidentStatusEnum.ACTIVE,
    neumann.getUserId(),
    [neumann.getUserId()],
    Date.now(),
  );

  groupMessage = new GroupMessage(
    TestDBClient.getInstance(),
    uuid(),
    neumann.getUserId(),
    'Hope everybody is doing okay!',
    SafetyStatusEnum.OK,
    Date.now(),
    incidentId,
    new Sentiment(0.0, 0.0),
  );

  await incident.insertThisIncident();
  await groupMessage.insertThisMessage();

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

test('Can retrieve incidents', async () => {
  let req = request(app)
    .get('/incidents')
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);
  await req.send().expect(200);
});

test('Can retrieve one incident by incidentId', async () => {
  let req = request(app)
    .get(`/incidents/${incident.incidentId}`)
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);
  await req.send().expect(200);
});

test('Can join incident', async () => {
  let req = request(app)
    .put(`/incidents/${incident.incidentId}`)
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);
  await req.send().expect(200);
});

test('Can retrieve group messages', async () => {
  let req = request(app)
    .get(`/chatRooms/groups/${incident.incidentId}`)
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);
  await req.send().expect(200);
});

test('Can post new group message', async () => {
  let body = {
    message: 'The fire engines are coming.',
  };
  let req = request(app)
    .post(`/chatRooms/groups/${incident.incidentId}`)
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);
  await req.send(body).expect(200);
}, 10000);

test('Can leave incident', async () => {
  let req = request(app)
    .delete(`/incidents/${incident.incidentId}`)
    .set('Authorization', `Bearer ${token}`)
    .set('cookie', sessionCookie);
  await req.send().expect(200);
});

test('Can leave incident as moderator', async () => {
  let nToken = jsonwebtoken.sign(
    {
      username: neumann.username,
      _id: neumann.getUserId(),
      type: neumann.type,
    },
    secrets.tokenSigningSecret,
    { expiresIn: '1h' },
  );
  let req = request(app)
    .delete(`/incidents/${incident.incidentId}`)
    .set('Authorization', `Bearer ${nToken}`)
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
  try {
    await neumann.userDAO.delete(SchemaType.USER, {
      username: neumann.username,
    });

    await jillian.userDAO.delete(SchemaType.USER, {
      username: jillian.username,
    });

    await incident.incidentDAO.delete(SchemaType.INCIDENT, {
      incidentId: incident.incidentId,
    });
  } catch (err) {
    // Do nothing
  }

  await State.getInstance().websocketSubsystem.close();
  await TestDBClient.getInstance().close();
  await server.close();
});
