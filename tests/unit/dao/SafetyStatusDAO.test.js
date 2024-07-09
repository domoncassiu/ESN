import { jest } from '@jest/globals';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDBClient from '../../../clients/TestDBClient';
import SafetyStatusDAO from '../../../dao/SafetyStatesDAO';
import SchemaEnum from '../../../clients/SchemaEnum';

const readMock = jest
  .spyOn(TestDBClient.prototype, 'read')
  .mockImplementation(() => {
    return { userId: 'id-1', safetyStatus: 'OK' };
  });
describe('single read', () => {
  test('single Safety Status: Nominal Scenario', async () => {
    let safetyDao = new SafetyStatusDAO(TestDBClient.getInstance());
    let result = await safetyDao.read({});

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readMock).toBeCalledTimes(1);
    expect(result).toStrictEqual({ userId: 'id-1', safetyStatus: 'OK' });
  });
});

describe('Fetch Many SafetyStatuses', () => {
  test('Return all safetystatuses: Nominal Scenario', async () => {
    const readAllWithPaginationMock = jest
      .spyOn(TestDBClient.prototype, 'readAllWithPagination')
      .mockImplementation(() => {
        return [{ userId: 'id-1', safetyStatus: 'OK' }];
      });

    let safetyDao = new SafetyStatusDAO(TestDBClient.getInstance());
    // Call the function
    let result = await safetyDao.readAllWithPagination({}, {}, 10, 1);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readAllWithPaginationMock).toBeCalledTimes(1);
    expect(result[0].safetyStatus).toStrictEqual('OK');
  });
});

describe('Create Single SafetyStatus', () => {
  test('Return created status: Nominal Scenario', async () => {
    let expectedStatus = { userId: 'id-1', safetyStatus: 'Help' };
    const createMock = jest
      .spyOn(TestDBClient.prototype, 'create')
      .mockImplementation(() => {
        return expectedStatus;
      });
    let safetyDao = new SafetyStatusDAO(TestDBClient.getInstance());
    // Call the function
    let result = await safetyDao.create(expectedStatus);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(createMock).toBeCalledTimes(1);
    expect(result.safetyStatus).toStrictEqual('Help');
  });
});

describe('Fetch Safety Statuses ReadAll', () => {
  test('Return All User Safety Status: Nominal Scenario', async () => {
    const readAllMock = jest
      .spyOn(TestDBClient.prototype, 'readAll')
      .mockImplementation(() => {
        return [{ userId: 'id-1', safetyStatus: 'Help' }];
      });

    let safetyDao = new SafetyStatusDAO(TestDBClient.getInstance());
    // Call the function
    let result = await safetyDao.readAll({}, {}, 10, 1);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readAllMock).toBeCalledTimes(1);
    expect(result[0].userId).toStrictEqual('id-1');
  });
});

describe('Delete safetystatuses history', () => {
  test('delete safetyStatus (used in testing): Nominal Scenario', async () => {
    const deleteMock = jest
      .spyOn(TestDBClient.prototype, 'delete')
      .mockImplementation(() => {
        return { deletedCount: 4 };
      });
    let safetyDao = new SafetyStatusDAO(TestDBClient.getInstance());
    // Call the function
    let deleteResult = await safetyDao.delete('id-1');

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(deleteMock).toBeCalledTimes(1);
    expect(deleteResult).toStrictEqual({ deletedCount: 4 });
  });
});

describe('Delete all safetystatuses', () => {
  test('delete all safetyStatus (used in testing): Nominal Scenario', async () => {
    const deleteAllMock = jest
      .spyOn(TestDBClient.prototype, 'deleteAll')
      .mockImplementation(() => {
        return { deletedCount: 100 };
      });
    let safetyDao = new SafetyStatusDAO(TestDBClient.getInstance());
    // Call the function
    let deleteResult = await safetyDao.deleteAll();
    expect(deleteAllMock).toBeCalledTimes(1);
  });
});

describe('Fetch SafetyStatuses with Aggregation', () => {
  test('Return aggregated User Safety Status: Nominal Scenario', async () => {
    const readAllWithAggregateMock = jest
      .spyOn(TestDBClient.prototype, 'readAllWithAggregate')
      .mockImplementation(() => {
        return [{ userId: 'id-1', safetyStatus: 'Help' }];
      });

    let safetyDao = new SafetyStatusDAO(TestDBClient.getInstance());
    // Call the function
    let result = await safetyDao.readAllWithAggregate({});
    expect(readAllWithAggregateMock).toBeCalledTimes(1);
  });
});
