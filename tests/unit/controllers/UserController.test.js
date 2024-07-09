import UserType from '../../../models/UserType';
import CurrentUserState from '../../../models/CurrentUserState.js';
import SafetyStatusEnum from '../../../models/SafetyStatusEnum';
import TestDbClient from '../../../bin/State';
import SafetyStatus from '../../../models/SafetyStatus';
import AuthenticatedUser from '../../../models/AuthenticatedUser.js';
import UserController from '../../../controllers/UserController';
import State from '../../../bin/State';
import WebsocketSubsystem from '../../../subsystems/WebsocketSubsystem';
import { expect, jest, test } from '@jest/globals';
import OnlineStatusEnum from '../../../models/OnlineStatusEnum';
import bcrypt from 'bcrypt';
import InternalServerError from '../../../exceptions/InternalServerError.js';
import Auth from '../../../middleware/auth.js';

// Mock functions
let getAllCurrentUsersStates = jest
  .spyOn(CurrentUserState, 'getAllCurrentUsersStates')
  .mockReturnValue({
    userId: 'testUserId1',
    username: 'mary',
    type: UserType.CITIZEN,
    acknowledged: true,
    isActive: true,
    onlineStatus: OnlineStatusEnum.ONLINE,
    safetyStatus: SafetyStatusEnum.OK,
  });
let fetchMostRecentSafetyStatus = jest
  .spyOn(SafetyStatus, 'fetchMostRecentSafetyStatus')
  .mockReturnValue(SafetyStatusEnum.OK);
let setUserSafetyStatus = jest
  .spyOn(SafetyStatus.prototype, 'setUserSafetyStatus')
  .mockImplementation(() => {
    console.log('mocked function');
  }); // comment this line if just want to "spy"
let onSafetyStatusChange = jest
  .spyOn(WebsocketSubsystem.prototype, 'onSafetyStatusChange')
  .mockImplementation(() => {
    console.log('mocked function');
  });

let getUserById = jest
  .spyOn(AuthenticatedUser, 'getUserById')
  .mockImplementation(() => {
    return { type: 'Citizen' };
  });

jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed');

let getUserByUsername = jest
  .spyOn(AuthenticatedUser, 'getUserByUsername')
  .mockImplementation(() => {
    return { username: 'mary' };
  });

let updateUser = jest
  .spyOn(AuthenticatedUser, 'updateUser')
  .mockImplementation(() => {
    return {
      userId: 'testUserId1',
      username: 'mary',
      type: UserType.CITIZEN,
      acknowledged: true,
      isActive: true,
      onlineStatus: OnlineStatusEnum.ONLINE,
      safetyStatus: SafetyStatusEnum.OK,
    };
  });

let getNewToken = jest.spyOn(Auth, 'getInstance').mockImplementation(() => {
  return { generateToken: () => 'mocked token' };
});

let findAllUsers = jest
  .spyOn(AuthenticatedUser, 'findAllUsers')
  .mockImplementation(() => {
    return [];
  });

let insertThisUser = jest
  .spyOn(AuthenticatedUser.prototype, 'insertThisUser')
  .mockImplementation(() => {});

describe('Testing controller: UserController', () => {
  test('Fetch all users with their state information: getEsnDirectory', async () => {
    const dbClient = TestDbClient.getInstance();
    let esnDirectory = await new UserController(dbClient).getEsnDirectory();
    expect(getAllCurrentUsersStates).toBeCalledTimes(1);
    expect(esnDirectory).toStrictEqual({
      userId: 'testUserId1',
      username: 'mary',
      type: UserType.CITIZEN,
      acknowledged: true,
      isActive: true,
      onlineStatus: OnlineStatusEnum.ONLINE,
      safetyStatus: SafetyStatusEnum.OK,
    });
  });

  test('Throw DB error: getEsnDirectory', async () => {
    const dbClient = TestDbClient.getInstance();
    let getAllCurrentUsersStates = jest
      .spyOn(CurrentUserState, 'getAllCurrentUsersStates')
      .mockRejectedValueOnce(new InternalServerError());
    expect(getAllCurrentUsersStates).toBeCalled();
    await expect(() =>
      new UserController(dbClient).getEsnDirectory(),
    ).rejects.toThrow(InternalServerError);
  });

  test('Fetch this users safety status: getUserSafetyStatus', async () => {
    const dbClient = TestDbClient.getInstance();
    let esnDirectory = await new UserController(dbClient).getUserSafetyStatus(
      'testUserId1',
    );
    expect(fetchMostRecentSafetyStatus).toBeCalledTimes(1);
    expect(esnDirectory).toStrictEqual(SafetyStatusEnum.OK);
  });

  test('Throw DB error: getUserSafetyStatus', async () => {
    const dbClient = TestDbClient.getInstance();
    let fetchMostRecentSafetyStatus = jest
      .spyOn(SafetyStatus, 'fetchMostRecentSafetyStatus')
      .mockRejectedValueOnce(new InternalServerError());
    expect(fetchMostRecentSafetyStatus).toBeCalled();
    await expect(() =>
      new UserController(dbClient).getUserSafetyStatus(),
    ).rejects.toThrow(InternalServerError);
  });

  test('Update this users safety status: updateUserSafetyStatus', async () => {
    const dbClient = TestDbClient.getInstance();
    State.getInstance().websocketSubsystem = new WebsocketSubsystem();
    await new UserController(dbClient).updateUserSafetyStatus(
      'testUserId1',
      SafetyStatusEnum.HELP,
    );
    expect(setUserSafetyStatus).toBeCalledTimes(1);
    expect(onSafetyStatusChange).toBeCalledTimes(1);
  });

  test('Throw DB error: updateUserSafetyStatus', async () => {
    const dbClient = TestDbClient.getInstance();
    let setUserSafetyStatus = jest
      .spyOn(SafetyStatus.prototype, 'setUserSafetyStatus')
      .mockRejectedValueOnce(new InternalServerError());
    expect(setUserSafetyStatus).toBeCalled();
    await expect(() =>
      new UserController(dbClient).updateUserSafetyStatus(),
    ).rejects.toThrow(InternalServerError);
  });

  test('Update this users safety status: getUserType', async () => {
    const dbClient = TestDbClient.getInstance();
    const result = await new UserController(dbClient).getUserType('id');
    expect(getUserById).toBeCalledTimes(1);
    expect(result).toEqual('Citizen');
  });

  test('Throw DB error: getUserType', async () => {
    const dbClient = TestDbClient.getInstance();
    let getUserById = jest
      .spyOn(AuthenticatedUser, 'getUserById')
      .mockRejectedValueOnce(new InternalServerError());
    expect(setUserSafetyStatus).toBeCalled();
    await expect(() =>
      new UserController(dbClient).getUserType(),
    ).rejects.toThrow(InternalServerError);
  });

  test('Update this users safety status: getUserByName', async () => {
    const dbClient = TestDbClient.getInstance();
    const result = await new UserController(dbClient).getUserByName('mary');
    expect(getUserByUsername).toBeCalledTimes(1);
    expect(result).toEqual({ username: 'mary' });
  });

  test('Throw DB error: getUserByName', async () => {
    const dbClient = TestDbClient.getInstance();
    let getUserByUsername = jest
      .spyOn(AuthenticatedUser, 'getUserByUsername')
      .mockRejectedValueOnce(new InternalServerError());
    expect(getUserByUsername).toBeCalled();
    await expect(() =>
      new UserController(dbClient).getUserByName(),
    ).rejects.toThrow(InternalServerError);
  });

  test('Update this users safety status: updateUser', async () => {
    const dbClient = TestDbClient.getInstance();
    const result = await new UserController(dbClient).updateUser(
      'testUserId1',
      {
        password: 'password',
      },
    );
    expect(getNewToken).toBeCalled();
    expect(updateUser).toBeCalledTimes(1);
    expect(result).toEqual({
      userId: 'testUserId1',
      username: 'mary',
      type: UserType.CITIZEN,
      acknowledged: true,
      isActive: true,
      onlineStatus: OnlineStatusEnum.ONLINE,
      safetyStatus: SafetyStatusEnum.OK,
    });
  });

  test('Throw DB error: updateUser', async () => {
    const dbClient = TestDbClient.getInstance();
    let updateUser = jest
      .spyOn(AuthenticatedUser, 'updateUser')
      .mockRejectedValueOnce(new InternalServerError());
    expect(updateUser).toBeCalled();
    await expect(() =>
      new UserController(dbClient).updateUser('testUserId1', {
        password: 'password',
      }),
    ).rejects.toThrow(InternalServerError);
  });

  // At-Least-One-Admin negative rule
  test('Update this users safety status: hasMoreThanOneAdmin', async () => {
    const dbClient = TestDbClient.getInstance();
    const result = await new UserController(dbClient).hasMoreThanOneAdmin();
    expect(findAllUsers).toBeCalledTimes(1);
    expect(result).toEqual(false);
  });

  // Initial-Admin Rule
  test('Throw DB error: hasMoreThanOneAdmin', async () => {
    const dbClient = TestDbClient.getInstance();
    let findAllUsers = jest
      .spyOn(AuthenticatedUser, 'findAllUsers')
      .mockRejectedValueOnce(new InternalServerError());
    expect(findAllUsers).toBeCalled();
    await expect(() =>
      new UserController(dbClient).hasMoreThanOneAdmin(),
    ).rejects.toThrow(InternalServerError);
  });

  test('Update this users safety status: initializeAdmin - Admin exists', async () => {
    const dbClient = TestDbClient.getInstance();
    await new UserController(dbClient).initializeAdmin();
    expect(getUserByUsername).toBeCalled();
    expect(insertThisUser).toBeCalledTimes(0);
  });

  test('Update this users safety status: initializeAdmin - Admin does not exist', async () => {
    const dbClient = TestDbClient.getInstance();
    let getUserByUsername = jest
      .spyOn(AuthenticatedUser, 'getUserByUsername')
      .mockImplementation();
    await new UserController(dbClient).initializeAdmin();
    expect(getUserByUsername).toBeCalled();
    expect(insertThisUser).toBeCalledTimes(1);
  });

  test('Throw DB error: initializeAdmin', async () => {
    const dbClient = TestDbClient.getInstance();
    let getUserByUsername = jest
      .spyOn(AuthenticatedUser, 'getUserByUsername')
      .mockRejectedValueOnce(new InternalServerError());
    expect(getUserByUsername).toBeCalled();
    await expect(() =>
      new UserController(dbClient).initializeAdmin(),
    ).rejects.toThrow(InternalServerError);
  });
});
