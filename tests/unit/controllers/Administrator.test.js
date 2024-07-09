import SearchController from '../../../controllers/SearchController';
import TestDBClient from '../../../clients/TestDBClient';
import { expect, jest, test } from '@jest/globals';
import State from '../../../bin/State';
import ModeEnum from '../../../bin/ModeEnum';
import UnauthenticatedUser from '../../../models/UnauthenticatedUser';
import LoginController from '../../../controllers/LoginController';
import { SchemaType } from 'mongoose';
import UserController from '../../../controllers/UserController';
import AuthenticatedUser from '../../../models/AuthenticatedUser';
import InternalServerError from '../../../exceptions/InternalServerError';
import CurrentUserState from '../../../models/CurrentUserState';
import UserType from '../../../models/UserType';
import OnlineStatusEnum from '../../../models/OnlineStatusEnum';
import SafetyStatusEnum from '../../../models/SafetyStatusEnum';
import e from 'express';
import WebsocketSubsystem from '../../../subsystems/WebsocketSubsystem';

const userController = new UserController(TestDBClient.getInstance());

// Spy functions
let getAllCurrentUsersStates = jest
  .spyOn(CurrentUserState, 'getAllCurrentUsersStates')
  .mockImplementation(async () => {
    const result = await userController.getUserByName('alice');
    if (result.isActive) {
      return [
        {
          userId: 'testUserId1',
          username: 'alice',
          type: UserType.CITIZEN,
          acknowledged: true,
          isActive: true,
          onlineStatus: OnlineStatusEnum.ONLINE,
          safetyStatus: SafetyStatusEnum.OK,
        },
      ];
    } else {
      return [];
    }
  });

let updateUser = jest.spyOn(AuthenticatedUser, 'updateUser');

let onUserInfoUpdate = jest
  .spyOn(WebsocketSubsystem.prototype, 'onUserInfoUpdate')
  .mockImplementation(() => {
    console.log('mocked function');
  });

State.getInstance().websocketSubsystem = new WebsocketSubsystem();

let alice = null;
let aliceId = null;
let adminId = null;
let authenticatedUser = new AuthenticatedUser(
  TestDBClient.getInstance(),
  'name',
  'password',
);

beforeAll(async () => {
  await TestDBClient.getInstance().connect();
  await State.getInstance().activateMode(ModeEnum.TEST);

  const unauthenticatedalice = new UnauthenticatedUser(
    TestDBClient.getInstance(),
    'alice',
    'password123',
  );

  try {
    await userController.initializeAdmin();
    const esnadmin = await userController.getUserByName('esnadmin');
    adminId = JSON.stringify(esnadmin._id).replace(/"/g, '');
    console.log('adminId', adminId);

    let lgc = new LoginController(TestDBClient.getInstance());
    alice = await userController.getUserByName('alice');
    if (!alice) {
      alice = await lgc.addUser(unauthenticatedalice);
    }
    aliceId = JSON.stringify(alice._id).replace(/"/g, '');
    console.log('idid', aliceId);
  } catch (err) {
    console.log(err);
  }
});

afterAll(async () => {
  await authenticatedUser.userDAO.deleteAll(SchemaType.USER);
  await TestDBClient.getInstance().close();
});

describe('Can modify user', () => {
  test('password', async () => {
    await userController.updateUser(aliceId, { password: 'password456' });
    expect(updateUser).toBeCalled();
  });

  test('username', async () => {
    await userController.updateUser(aliceId, { username: 'alice1' });
    expect(onUserInfoUpdate).toBeCalled();
    expect(updateUser).toBeCalled();
    let result = await userController.getUserByName('alice1');
    expect(JSON.stringify(result._id).replace(/"/g, '')).toEqual(aliceId);
    await userController.updateUser(aliceId, { username: 'alice' });
    result = await userController.getUserByName('alice');
    expect(JSON.stringify(result._id).replace(/"/g, '')).toEqual(aliceId);
  });

  test('Active to inactive', async () => {
    console.log(aliceId);
    await userController.updateUser(aliceId, { isActive: false });
    expect(updateUser).toBeCalled();
    let result = await userController.getUserByName('alice');
    console.log(result);
    expect(result.isActive).toEqual(false);
  });

  test('Inactive to active', async () => {
    await userController.updateUser(aliceId, { isActive: true });
    expect(updateUser).toBeCalled();
    let result = await userController.getUserByName('alice');
    console.log(result);
    expect(result.isActive).toEqual(true);
  });

  test('ESN directory does not return inactive user', async () => {
    await userController.updateUser(aliceId, { isActive: false });
    expect(updateUser).toBeCalled();
    let result = await userController.getEsnDirectory(1, 10, true);
    expect(result).toEqual([]);
  });

  test('ESN directory return active user', async () => {
    await userController.updateUser(aliceId, { isActive: true });
    expect(updateUser).toBeCalled();
    let result = await userController.getEsnDirectory(1, 10, true);
    expect(result).toEqual([
      {
        userId: 'testUserId1',
        username: 'alice',
        type: UserType.CITIZEN,
        acknowledged: true,
        isActive: true,
        onlineStatus: OnlineStatusEnum.ONLINE,
        safetyStatus: SafetyStatusEnum.OK,
      },
    ]);
  });

  test('Throw DB Error', async () => {
    let updateUser = jest
      .spyOn(AuthenticatedUser, 'updateUser')
      .mockRejectedValueOnce(new InternalServerError());
    await expect(() =>
      userController.updateUser(aliceId, { isActive: true }),
    ).rejects.toThrow(InternalServerError);
  });
});
