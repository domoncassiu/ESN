import TestDBClient from '../../../clients/TestDBClient';
import State from '../../../bin/State';
import ModeEnum from '../../../bin/ModeEnum';
import IncidentController from '../../../controllers/IncidentController';
import GroupMessage from '../../../models/GroupMessage';
import SafetyStatusEnum from '../../../models/SafetyStatusEnum';
import Sentiment from '../../../models/Sentiment';
import Incident from '../../../models/Incident';
import IncidentStatusEnum from '../../../models/IncidentStatusEnum';
import { expect, jest, test } from '@jest/globals';
import IncidentDAO from '../../../dao/IncidentDAO';
import { SchemaType } from 'mongoose';
import UnauthenticatedUser from '../../../models/UnauthenticatedUser';
import LoginController from '../../../controllers/LoginController';
import InvalidEntryError from '../../../exceptions/InvalidEntryError';
import AuthenticatedUser from '../../../models/AuthenticatedUser';
import WebsocketSubsystem from '../../../subsystems/WebsocketSubsystem';
import { uuid } from 'uuidv4';
import GroupMessageDAO from '../../../dao/GroupMessageDAO';

// Mock functions
let sendGroupMessage = jest
  .spyOn(WebsocketSubsystem.prototype, 'sendGroupMessage')
  .mockImplementation(() => {
    console.log('sendGroupMessage called.');
  });

let incidentController = null;
let groupMessage = null;
let groupMessage2 = null;
let incident = null;
let dave = null;
let carla = null;
let incident2 = null;
let incidentId = uuid();
beforeAll(async () => {
  await TestDBClient.getInstance().connect();
  State.getInstance().websocketSubsystem = new WebsocketSubsystem();
  await State.getInstance().activateMode(ModeEnum.TEST);
  incidentController = new IncidentController(TestDBClient.getInstance());

  let newDave = new UnauthenticatedUser(
    TestDBClient.getInstance(),
    'dave',
    'password123',
  );
  let newCarla = new UnauthenticatedUser(
    TestDBClient.getInstance(),
    'carla',
    'password123',
  );

  let lgc = new LoginController(TestDBClient.getInstance());
  dave = await lgc.addUser(newDave);
  carla = await lgc.addUser(newCarla);

  incident = new Incident(
    TestDBClient.getInstance(),
    incidentId,
    'Bay Area Wildfire',
    'California Wildfires 2024',
    -122.0787153,
    37.4053896,
    IncidentStatusEnum.ACTIVE,
    dave.getUserId(),
    [dave.getUserId],
    Date.now(),
  );

  groupMessage = new GroupMessage(
    TestDBClient.getInstance(),
    'unit-test-group-message',
    dave.getUserId(),
    'Hello, there!',
    SafetyStatusEnum.OK,
    Date.now(),
    incidentId,
    new Sentiment(0.0, 0.0),
  );

  await incident.insertThisIncident();
  await groupMessage.insertThisMessage();
});

describe('Testing controller: IncidentController', () => {
  test('Testing create new incident: createNewIncident', async () => {
    incident2 = await incidentController.createNewIncident(
      dave.getUserId(),
      'New Incident',
      'New Event',
      -122.0787153,
      37.4053896,
    );
    // _id is created by DB, so if returned, we can guarantee that a new record was created
    expect(incident2.incidentId).toBeDefined();
  });
  test('Testing join incident: joinIncident', async () => {
    let result = await incidentController.joinIncident(
      incident2.incidentId,
      carla.getUserId(),
    );
    console.log(result);
    expect(result.lastErrorObject.updatedExisting).toStrictEqual(true);
  });
  test('Testing join incident with invalid data: joinIncident', async () => {
    try {
      await incidentController.joinIncident(incident.incidentId, 'wrong-id');
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toBe('Invalid data');
    }
  });
  test('Testing leave incident: leaveIncident', async () => {
    let result = await incidentController.leaveIncident(
      carla.getUserId(),
      incident2.incidentId,
    );
    expect(result.lastErrorObject.updatedExisting).toStrictEqual(true);
  });
  test('Testing leave incident where moderator leaves: leaveIncident', async () => {
    let result = await incidentController.leaveIncident(
      dave.getUserId(),
      incident2.incidentId,
    );
    expect(result).toBeDefined();
  });
  test('Testing incident search: fetchAllIncidents', async () => {
    let result = await incidentController.fetchAllIncidents(1, 50, false);
    expect(result.length).toBeGreaterThan(0);
  });
  test('Testing messages retrieval for one incident: fetchAllMessages', async () => {
    let result = await incidentController.fetchAllMessages(incident.incidentId);
    expect(result).toBeDefined();
  });
  test('Test store new Message: storeNewMessage', async () => {
    console.log("Carla's id: ", carla._id.toString());
    await incidentController.storeNewMessage(
      carla.getUserId(),
      carla.username,
      'Hello, Dave!',
      incidentId,
    );
    expect(sendGroupMessage).toBeCalledTimes(1);
  });
  test('Test update sentiment: updateSentiment', async () => {
    let newSentiment = {
      score: -0.9,
      magnitude: 0.3,
    };

    let result = await incidentController.updateSentiment(
      newSentiment,
      groupMessage.messageId,
      groupMessage.incidentId,
    );
    console.log(result);
    expect(result.lastErrorObject.updatedExisting).toStrictEqual(true);
  });
  test('Test update sentiment with invalid messageId: updateSentiment', async () => {
    let newSentiment = {
      score: -0.9,
      magnitude: 0.3,
    };

    let messageId = 'wrong-id';
    try {
      let result = await incidentController.updateSentiment(
        newSentiment,
        messageId,
        groupMessage.incidentId,
      );
      console.log(result);
    } catch (err) {
      expect(err.message).toBe('Invalid data');
    }
  });
});

afterAll(async () => {
  await incident.incidentDAO.delete(SchemaType.INCIDENT, {
    incidentId: incident.incidentId,
  });

  await incident.incidentDAO.delete(SchemaType.INCIDENT, {
    incidentId: incident2.incidentId,
  });

  await new GroupMessageDAO(TestDBClient.getInstance()).delete(
    SchemaType.GROUPMESSAGE,
    {
      messageId: groupMessage.messageId,
    },
  );

  await dave.userDAO.delete(SchemaType.USER, {
    _id: dave.getUserId(),
  });

  await carla.userDAO.delete(SchemaType.USER, {
    _id: carla.getUserId(),
  });

  await TestDBClient.getInstance().close();
});
