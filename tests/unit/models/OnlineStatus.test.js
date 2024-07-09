import { expect, jest, test } from '@jest/globals';
import OnlineStatusDAO from '../../../dao/OnlineStatusDAO';
import OnlineStatus from '../../../models/OnlineStatus';
import TestDBClient from '../../../clients/TestDBClient';
import OnlineStatusEnum from '../../../models/OnlineStatusEnum';

// Mock function
let update = jest
  .spyOn(OnlineStatusDAO.prototype, 'update')
  .mockImplementation(() => true);

let readAll = jest
  .spyOn(OnlineStatusDAO.prototype, 'readAll')
  .mockImplementation(() => [
    {
      username: 'mary',
      onlineStatus: OnlineStatusEnum.ONLINE,
      lastOnline: 1711581345192,
      timestamp: 1711581345193,
    },
  ]);

let read = jest
  .spyOn(OnlineStatusDAO.prototype, 'read')
  .mockImplementation(() => {
    return {
      userId: 'mary',
      onlineStatus: OnlineStatusEnum.ONLINE,
      lastOnline: 1711581345192,
      timestamp: 1711581345193,
    };
  });

let onlineStatus = new OnlineStatus(
  TestDBClient.getInstance(),
  'mary',
  OnlineStatusEnum.ONLINE,
  1711581345192,
  Date.now(),
);

describe('Testing Model: OnlineStatus', () => {
  test('Test set user online status: setUserOnlineStatus', async () => {
    let isUpdated = await onlineStatus.setUserOnlineStatus(true);
    expect(update).toBeCalledTimes(1);
    expect(isUpdated).toBe(true);
  });
  test('Test fetching of online status map for multiple users: fetchOnlineStatusMapOf', async () => {
    let onlineStatusMap = await OnlineStatus.fetchOnlineStatusMapOf(
      TestDBClient.getInstance(),
      ['mary'],
    );
    expect(readAll).toBeCalledTimes(1);
    expect(onlineStatusMap['mary']).toStrictEqual(OnlineStatusEnum.OFFLINE);
  });
  test('Test fetching of online status for one user: fetchOnlineStatusOf', async () => {
    let onlineStatus = await OnlineStatus.fetchOnlineStatusOf(
      TestDBClient.getInstance(),
      'mary',
    );
    expect(read).toBeCalledTimes(1);
    expect(onlineStatus).toStrictEqual({
      userId: 'mary',
      onlineStatus: OnlineStatusEnum.ONLINE,
      lastOnline: 1711581345192,
      timestamp: 1711581345193,
    });
  });
});
