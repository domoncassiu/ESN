import { jest } from '@jest/globals';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDBClient from '../../../clients/TestDBClient';
import PublicMessageDAO from '../../../dao/PublicMessageDAO';

describe('Fetch Public Messages', () => {
  test('Return all Public Messages: Nominal Scenario', async () => {
    const readAllWithPaginationMock = jest
      .spyOn(TestDBClient.prototype, 'readAllWithPagination')
      .mockImplementation(() => {
        return [{ messageId: 'msg1', message: 'message', senderId: 'id1' }];
      });

    let pubmsgDao = new PublicMessageDAO(TestDBClient.getInstance());
    // Call the function
    let result = await pubmsgDao.readAllWithPagination({}, {}, 10, 1);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readAllWithPaginationMock).toBeCalledTimes(1);
    expect(result[0]).toStrictEqual({
      messageId: 'msg1',
      message: 'message',
      senderId: 'id1',
    });
  });
});

describe('Create Single PublicMessage', () => {
  test('Return created PublicMessage: Nominal Scenario', async () => {
    let expectedMessage = {
      messageId: 'msg1',
      message: 'message',
      senderId: 'id1',
    };
    const createMock = jest
      .spyOn(TestDBClient.prototype, 'create')
      .mockImplementation(() => {
        return expectedMessage;
      });
    let pubmsgDao = new PublicMessageDAO(TestDBClient.getInstance());
    // Call the function
    let result = await pubmsgDao.create(expectedMessage);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(createMock).toBeCalledTimes(1);
    expect(result).toStrictEqual(expectedMessage);
  });
});
