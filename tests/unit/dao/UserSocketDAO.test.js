import { jest } from '@jest/globals';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDBClient from '../../../clients/TestDBClient';
import UserSocketDAO from '../../../dao/UserSocketDAO';

let userSocketDao = new UserSocketDAO(TestDBClient.getInstance());
const readMock = jest
  .spyOn(TestDBClient.prototype, 'read')
  .mockImplementation(() => {
    return { userId: 'id-1', socketId: 'socketid-1' };
  });
describe('single read', () => {
  test('single User return: Nominal Scenario', async () => {
    let result = await userSocketDao.read({});

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readMock).toBeCalledTimes(1);
    expect(result).toStrictEqual({ userId: 'id-1', socketId: 'socketid-1' });
  });
});

describe('Create Single user', () => {
  test('Return created user: Nominal Scenario', async () => {
    let expectedscoket = { userId: 'id-1', socketId: 'socketid-1' };
    const createMock = jest
      .spyOn(TestDBClient.prototype, 'create')
      .mockImplementation(() => {
        return expectedscoket;
      });
    let result = await userSocketDao.create(expectedscoket);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(createMock).toBeCalledTimes(1);
    expect(result.userId).toStrictEqual('id-1');
  });
});

describe('Delete user socket (for testing)', () => {
  test('delete user socket: Nominal Scenario', async () => {
    const deleteMock = jest
      .spyOn(TestDBClient.prototype, 'delete')
      .mockImplementation(() => {
        return { deletedCount: 1 };
      });
    let deleteResult = await userSocketDao.delete('id-1');

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(deleteMock).toBeCalledTimes(1);
    expect(deleteResult.deletedCount).toStrictEqual(1);
  });
});

describe('Update A user socketId', () => {
  test('Return updated socket entry: Nominal Scenario', async () => {
    const expectedDocument = { userId: 'id-1', socketId: 'socketid-2' };
    const updateMock = jest
      .spyOn(TestDBClient.prototype, 'update')
      .mockImplementation(() => {
        return expectedDocument;
      });
    let result = await userSocketDao.update(
      { userId: 'id-1' },
      { socketId: 'socketid-2' },
      {},
    );

    expect(updateMock).toBeCalledTimes(1);
    expect(result).toStrictEqual(expectedDocument);
  });
});
