import { expect, jest, test } from '@jest/globals';
import OnlineStatusDAO from '../../../dao/OnlineStatusDAO';
import OnlineStatusEnum from '../../../models/OnlineStatusEnum';
import SafetyStatusEnum from '../../../models/SafetyStatusEnum';
import SafetyStatusDAO from '../../../dao/SafetyStatesDAO';
import OnlineStatus from '../../../models/OnlineStatus';
import TestDBClient from '../../../clients/TestDBClient';
import SafetyStatus from '../../../models/SafetyStatus';

// Mock functions

let readAllWithPagination = jest
  .spyOn(SafetyStatusDAO.prototype, 'readAllWithPagination')
  .mockImplementation(() => [
    {
      username: 'mary',
      safetyStatus: SafetyStatusEnum.OK,
      timestamp: 1711581345193,
    },
  ]);

let readAll = jest
  .spyOn(SafetyStatusDAO.prototype, 'readAll')
  .mockImplementation(() => [
    {
      username: 'mary',
      safetyStatus: SafetyStatusEnum.OK,
      timestamp: 1711581345193,
    },
  ]);

let read = jest
  .spyOn(SafetyStatusDAO.prototype, 'read')
  .mockImplementation(() => {
    return {
      username: 'mary',
      safetyStatus: SafetyStatusEnum.OK,
      timestamp: 1711581345193,
    };
  });

let create = jest
  .spyOn(SafetyStatusDAO.prototype, 'create')
  .mockImplementation(() => true);

let safetyStatus = new SafetyStatus(
  TestDBClient.getInstance(),
  'mary',
  SafetyStatusEnum.OK,
  1711581345193,
);

describe('Test Model: SafetyStatus', () => {
  test('Test set user safety status: setUserSafetyStatus', async () => {
    let isUpdated = await safetyStatus.setUserSafetyStatus();
    expect(create).toBeCalledTimes(1);
    expect(isUpdated).toBe(true);
  });

  test('Test get most recent user safety status: fetchMostRecentSafetyStatus', async () => {
    let isUpdated = await SafetyStatus.fetchMostRecentSafetyStatus(
      TestDBClient.getInstance(),
      'mary',
    );
    expect(read).toBeCalledTimes(1);
    expect(create).toBeCalledTimes(1);
    expect(isUpdated).toBe(SafetyStatusEnum.OK);
  });

  test('Test fetch all safety statuses: fetchAllStatuses', async () => {
    let result = await SafetyStatus.fetchAllStatuses(
      TestDBClient.getInstance(),
    );
    expect(result).toStrictEqual([
      {
        username: 'mary',
        safetyStatus: SafetyStatusEnum.OK,
        timestamp: 1711581345193,
      },
    ]);
    expect(readAllWithPagination).toBeCalledTimes(1);
  });

  test('Test safety status map for multiple users: fetchSafetyStatusMapOf', async () => {
    let safetyStatusMap = await SafetyStatus.fetchSafetyStatusMapOf(
      TestDBClient.getInstance(),
      ['mary'],
    );
    expect(readAll).toBeCalledTimes(1);
    expect(safetyStatusMap['mary']).toStrictEqual('Undefined');
  });
});
