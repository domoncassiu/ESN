import CurrentUserState from '../../../models/CurrentUserState';
import SearchController from '../../../controllers/SearchController';
import TestDBClient from '../../../clients/TestDBClient';
import OnlineStatusEnum from '../../../models/OnlineStatusEnum';
import SafetyStatusEnum from '../../../models/SafetyStatusEnum';
import { expect, jest, test } from '@jest/globals';
import Announcement from '../../../models/Announcement';
import PublicMessage from '../../../models/PublicMessage';
import SafetyStatus from '../../../models/SafetyStatus';
import PrivateMessage from '../../../models/PrivateMessage';
import PrivateMessageStatusEnum from '../../../models/PrivateMessageReadStatusEnum';
import PrivateMessageReadStatusEnum from '../../../models/PrivateMessageReadStatusEnum';
import State from '../../../bin/State';
import ModeEnum from '../../../bin/ModeEnum';
import OnlineStatus from '../../../models/OnlineStatus';
import UnauthenticatedUser from '../../../models/UnauthenticatedUser';
import LoginController from '../../../controllers/LoginController';
import { SchemaType } from 'mongoose';
import AuthenticatedUser from '../../../models/AuthenticatedUser';

let searchController = new SearchController(TestDBClient.getInstance());

// Spy functions
let getAllCurrentUsersStates = jest.spyOn(
  CurrentUserState,
  'getAllCurrentUsersStates',
);

jest.setTimeout(10000);

let getUsersByStatus = jest.spyOn(CurrentUserState, 'getUsersByStatus');

// let getUserByUsername = jest.spyOn(AuthenticatedUser, 'getUserByUsername').mockReturnValue({
//   _id: '123',
//   username: ''
// });

let fetchAllAnnouncements = jest.spyOn(Announcement, 'fetchAllAnnouncements');

let fetchAllMessagesPublic = jest.spyOn(PublicMessage, 'fetchAllMessages');

let fetchAllStatuses = jest.spyOn(SafetyStatus, 'fetchAllStatuses');

let fetchAllMessagesPrivate = jest.spyOn(PrivateMessage, 'fetchAllMessages');

let alice = null;
let aliceId = null;
let bob = null;
let bobId = null;
let safetyStatus = null;

beforeAll(async () => {
  await TestDBClient.getInstance().connect();
  await State.getInstance().activateMode(ModeEnum.TEST);

  let dbClient = TestDBClient.getInstance();
  alice = new UnauthenticatedUser(
    TestDBClient.getInstance(),
    'alice',
    'password123',
  );
  bob = new UnauthenticatedUser(
    TestDBClient.getInstance(),
    'bob',
    'password123',
  );
  try {
    let lgc = new LoginController(TestDBClient.getInstance());
    aliceId = await lgc.addUser(alice);
    aliceId = JSON.stringify(aliceId._id).replace(/"/g, '');
    bobId = await lgc.addUser(bob);
    bobId = JSON.stringify(bobId._id).replace(/"/g, '');
    safetyStatus = new SafetyStatus(
      TestDBClient.getInstance(),
      aliceId,
      SafetyStatusEnum.OK,
      Date.now(),
    );
    console.log('idddd2', aliceId);
  } catch (err) {}

  await new Announcement(
    dbClient,
    '12345',
    aliceId,
    'Hello, World!',
    Date.now(),
  ).insertThisAnnoucement();
  await new PrivateMessage(
    TestDBClient.getInstance(),
    '12345',
    aliceId,
    'Hello, Bob!',
    SafetyStatusEnum.OK,
    Date.now(),
    'bob',
    PrivateMessageReadStatusEnum.READ,
  ).insertThisMessage();
  await new SafetyStatus(
    TestDBClient.getInstance(),
    aliceId,
    SafetyStatusEnum.OK,
    Date.now(),
  ).setUserSafetyStatus();
  await new SafetyStatus(
    TestDBClient.getInstance(),
    bobId,
    SafetyStatusEnum.OK,
    Date.now(),
  ).setUserSafetyStatus();
  await new OnlineStatus(
    TestDBClient.getInstance(),
    'alice',
    OnlineStatusEnum.ONLINE,
    Date.now(),
  ).setUserOnlineStatus(true);
  await new OnlineStatus(
    TestDBClient.getInstance(),
    'bob',
    OnlineStatusEnum.ONLINE,
    Date.now(),
  ).setUserOnlineStatus(true);
});

afterAll(async () => {
  await alice.userDAO.delete(SchemaType.USER, {
    username: alice.username,
  });
  await bob.userDAO.delete(SchemaType.USER, {
    username: bob.username,
  });
  console.log('???', safetyStatus);
  await safetyStatus.safetyStatusDAO.deleteAll();
  await TestDBClient.getInstance().close();
});

describe('Testing controller: SearchController', () => {
  test('Verify citizen search: searchCitizens', async () => {
    let citizens = await searchController.searchCitizens(1, 'alice');
    expect(getAllCurrentUsersStates).toBeCalled();
    expect(citizens[0].username).toBe('alice');
    expect(citizens[0].safetyStatus).toBe('OK');
  }, 10000);
  test('Verify wrong citizen search: searchCitizens', async () => {
    let citizens = await searchController.searchCitizens(1, 'alice3');
    expect(getAllCurrentUsersStates).toBeCalledTimes(2);
    expect(citizens).toStrictEqual([]);
  });
  test('Verify status search: searchStatuses', async () => {
    let citizens = await searchController.searchStatuses(SafetyStatusEnum.OK);
    expect(getUsersByStatus).toBeCalledTimes(1);
  }, 10000);

  test('Verify public announcement search: searchPublicAnnouncements', async () => {
    let announcements = await searchController.searchPublicAnnouncements(
      1,
      'World',
    );
    expect(fetchAllAnnouncements).toBeCalledTimes(1);
    expect(announcements[0].userId).toBe(aliceId);
    expect(announcements[0].message).toBe('Hello, World!');
  }, 10000);
  test('Verify public announcement search w stop word: searchPublicAnnouncements', async () => {
    let announcements = await searchController.searchPublicAnnouncements(
      1,
      'after',
    );
    expect(fetchAllAnnouncements).toBeCalledTimes(2);
    expect(announcements).toStrictEqual([]);
  }, 10000);

  // test('Verify public message search: searchPublicMessage', async () => {
  //   let publicMessages = await searchController.searchPublicMessage(1, 'ESN');
  //   expect(fetchAllMessagesPublic).toBeCalledTimes(1);
  //   expect(publicMessages).toStrictEqual([]);
  // });

  test('Verify user status search: searchUsersStatuses', async () => {
    let statuses = await searchController.searchUsersStatuses(1, aliceId);
    expect(fetchAllStatuses).toBeCalledTimes(1);
    expect(statuses[0].safetyStatus).toBe('OK');
    expect(statuses[0].userId).toBe(aliceId);
  }, 10000);
  test('Verify wrong user status search: searchUsersStatuses', async () => {
    let statuses = await searchController.searchUsersStatuses(1, 'Asdfghjkl');
    expect(statuses).toStrictEqual([]);
  }, 10000);

  // test('verify private message search: searchPrivateMessage', async () => {
  //   let privateMessages = await searchController.searchPrivateMessage(
  //     1,
  //     'Hello',
  //     'alice',
  //     'bob',
  //   );
  //   expect(fetchAllMessagesPrivate).toBeCalledTimes(1);
  //   expect(privateMessages[0].sender).toBe('alice');
  //   expect(privateMessages[0].message).toBe('Hello, Bob!');
  // });
  // test('verify private message search w stop word: searchPrivateMessage', async () => {
  //   let privateMessages = await searchController.searchPrivateMessage(
  //     1,
  //     'across',
  //     'alice',
  //     'bob',
  //   );
  //   expect(fetchAllMessagesPrivate).toBeCalledTimes(2);
  //   expect(privateMessages).toStrictEqual([]);
  // });
});
