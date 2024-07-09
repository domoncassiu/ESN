import UserType from '../../../models/UserType';
import CurrentUserState from '../../../models/CurrentUserState.js';
import OnlineStatus from '../../../models/OnlineStatus';
import OnlineStatusEnum from '../../../models/OnlineStatusEnum';
import SafetyStatusEnum from '../../../models/SafetyStatusEnum';
import TestDbClient from '../../../bin/State';
import SafetyStatus from '../../../models/SafetyStatus';
import { jest } from '@jest/globals';
import UserDAO from '../../../dao/UserDAO';
import SafetyStatusDAO from '../../../dao/SafetyStatesDAO';
import { ObjectId } from 'mongodb';
import AuthenticatedUser from '../../../models/AuthenticatedUser.js';

let fetchOnlineStatusOf = jest
  .spyOn(OnlineStatus, 'fetchOnlineStatusMapOf')
  .mockImplementation(() => {
    return {
      testUserId: OnlineStatusEnum.ONLINE,
    };
  });
let fetchSafetyStatusOf = jest
  .spyOn(SafetyStatus, 'fetchSafetyStatusMapOf')
  .mockImplementation(() => {
    return {
      testUserId: SafetyStatusEnum.OK,
    };
  });
let getUserById = jest
  .spyOn(AuthenticatedUser, 'getUserById')
  .mockImplementation(() => {
    return { username: 'mary', _id: 'testUserId', type: 'Citizen' };
  });
let readAllWithPagination = jest
  .spyOn(UserDAO.prototype, 'readAllWithPagination')
  .mockImplementation(() => {
    return [
      {
        _id: 'testUserId',
        username: 'mary',
        password:
          '$2a$10$289FUpNF3M8LDzV2fl4ZtuEb2axpzYJUAPX8xQOBKLxGVWMjn/QoO',
        type: UserType.CITIZEN,
        acknowledged: true,
        isActive: true,
      },
    ];
  });
let readAllWithAggregate = jest
  .spyOn(SafetyStatusDAO.prototype, 'readAllWithAggregate')
  .mockImplementation(() => {
    return [
      {
        userId: 'testUserId',
        safetyStatus: SafetyStatusEnum.OK,
        timestamp: 1711581345192,
      },
    ];
  });
describe('Testing model: CurrentUserState', () => {
  test('Fetch all users with their state information: getAllCurrentUsersStates', async () => {
    const dbClient = TestDbClient.getInstance();
    let result = await CurrentUserState.getAllCurrentUsersStates(dbClient);
    expect(fetchOnlineStatusOf).toBeCalledTimes(1);
    expect(fetchSafetyStatusOf).toBeCalledTimes(1);
    expect(readAllWithPagination).toBeCalledTimes(1);
    expect(result).toStrictEqual([
      {
        username: 'mary',
        type: UserType.CITIZEN,
        acknowledged: true,
        isActive: true,
        onlineStatus: OnlineStatusEnum.ONLINE,
        safetyStatus: SafetyStatusEnum.OK,
        userId: 'testUserId',
      },
    ]);
  });

  test('Test aggregate query: getUsersByStatus', async () => {
    const dbClient = TestDbClient.getInstance();
    let result = await CurrentUserState.getUsersByStatus(
      dbClient,
      SafetyStatusEnum.OK,
    );
    expect(readAllWithAggregate).toBeCalledTimes(1);
    expect(result).toStrictEqual([
      {
        userId: undefined,
        username: 'mary',
        timestamp: 1711581345192,
        onlineStatus: undefined,
        safetyStatus: SafetyStatusEnum.OK,
      },
    ]);
  });
});
