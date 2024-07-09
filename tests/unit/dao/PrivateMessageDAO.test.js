import { jest } from '@jest/globals';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDBClient from '../../../clients/TestDBClient';
import PrivateMessageDAO from '../../../dao/PrivateMessageDAO';
import SchemaEnum from '../../../clients/SchemaEnum';

describe('Fetch PrivateMessages', () => {
  test('Return all PrivateMessages: Nominal Scenario', async () => {
    const readAllWithPaginationMock = jest
      .spyOn(TestDBClient.prototype, 'readAllWithPagination')
      .mockImplementation(() => {
        return [
          {
            messageId: 'msg1',
            message: 'hello',
            senderId: 'id1',
            receiverId: 'id2',
          },
        ];
      });

    let privMsgDAO = new PrivateMessageDAO(TestDBClient.getInstance());
    // Call the function
    let result = await privMsgDAO.readAllWithPagination({}, {}, 10, 1);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readAllWithPaginationMock).toBeCalledTimes(1);
    expect(result[0]).toStrictEqual({
      messageId: 'msg1',
      message: 'hello',
      senderId: 'id1',
      receiverId: 'id2',
    });
  });
});

describe('Create Single PrivateMessage', () => {
  test('Return created PrivateMessage: Nominal Scenario', async () => {
    let expectedPrivMsg = {
      messageId: 'msg1',
      message: 'hello',
      senderId: 'id1',
      receiverId: 'id2',
    };
    const createMock = jest
      .spyOn(TestDBClient.prototype, 'create')
      .mockImplementation(() => {
        return expectedPrivMsg;
      });
    let privMsgDAO = new PrivateMessageDAO(TestDBClient.getInstance());
    // Call the function
    let result = await privMsgDAO.create(expectedPrivMsg);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(createMock).toBeCalledTimes(1);
    expect(result).toStrictEqual(expectedPrivMsg);
  });
});

describe('Update Many PrivateMessage ReadStatus', () => {
  test('Return number of docs updated: Nominal Scenario', async () => {
    const updateManyMock = jest
      .spyOn(TestDBClient.prototype, 'updateMany')
      .mockImplementation(() => {
        return { matchedCount: 4, modifiedCount: 4 };
      });
    let privMsgDAO = new PrivateMessageDAO(TestDBClient.getInstance());
    // Call the function
    let result = await privMsgDAO.updateMany(
      { senderId: 'id1', receiverId: 'id2' },
      { $set: { readStatus: 'Read' } },
      {},
    );

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(updateManyMock).toBeCalledTimes(1);
    expect(result).toStrictEqual({ matchedCount: 4, modifiedCount: 4 });
  });
});
