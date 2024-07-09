import { jest } from '@jest/globals';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDBClient from '../../../clients/TestDBClient';
import OnlineStatusDAO from '../../../dao/OnlineStatusDAO';
import SchemaEnum from '../../../clients/SchemaEnum';

const readMock = jest
  .spyOn(TestDBClient.prototype, 'read')
  .mockImplementation(() => {
    return { userId: 'id-1', onlineStatus: 'Online' };
  });

describe('single read', () => {
  test('single user online status: Nominal Scenario', async () => {
    let onlineDao = new OnlineStatusDAO(TestDBClient.getInstance());
    // Call the function
    let result = await onlineDao.read({});

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readMock).toBeCalledTimes(1);
    expect(result).toStrictEqual({ userId: 'id-1', onlineStatus: 'Online' });
  });
});

describe('Fetch Online Statuses', () => {
  test('Return All User Online Status: Nominal Scenario', async () => {
    const readAllMock = jest
      .spyOn(TestDBClient.prototype, 'readAll')
      .mockImplementation(() => {
        return [{ userId: 'id-1', onlineStatus: 'Online' }];
      });

    let onlineDao = new OnlineStatusDAO(TestDBClient.getInstance());
    // Call the function
    let result = await onlineDao.readAll({}, {}, 10, 1);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readAllMock).toBeCalledTimes(1);
    expect(result[0].userId).toStrictEqual('id-1');
  });
});

describe('Upsert Single OnlineStatus', () => {
  test('Return created onlinestatus: Nominal Scenario', async () => {
    const expectedDocument = { userId: 'id-1', onlineStatus: 'Online' };
    const updateMock = jest
      .spyOn(TestDBClient.prototype, 'update')
      .mockImplementation(() => {
        return expectedDocument;
      });
    let onlineDao = new OnlineStatusDAO(TestDBClient.getInstance());
    let result = await onlineDao.update(
      { userId: 'id-1' },
      { onlineStaus: 'Online' },
      { upsert: true },
    );

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(updateMock).toBeCalledTimes(1);
    expect(result).toStrictEqual(expectedDocument);
  });
});
