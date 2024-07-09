import { jest } from '@jest/globals';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDBClient from '../../../clients/TestDBClient';
import GroupMessageDAO from '../../../dao/GroupMessageDAO';

let groupDao = new GroupMessageDAO(TestDBClient.getInstance());
const readMock = jest
  .spyOn(TestDBClient.prototype, 'read')
  .mockImplementation(() => {
    return { message: 'message', senderId: 'id1', incidenId: 'iid-1' };
  });
describe('single read', () => {
  test('single group message: Nominal Scenario', async () => {
    let result = await groupDao.read({});

    expect(readMock).toBeCalledTimes(1);
    expect(result.senderId).toStrictEqual('id1');
  });
});

describe('Fetch Many group messages with pagination', () => {
  test('Return Many group messages: Nominal Scenario', async () => {
    const readAllWithPaginationMock = jest
      .spyOn(TestDBClient.prototype, 'readAllWithPagination')
      .mockImplementation(() => {
        return [{ message: 'message', senderId: 'id1', incidenId: 'iid-1' }];
      });
    let result = await groupDao.readAllWithPagination({}, {}, 10, 1);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readAllWithPaginationMock).toBeCalledTimes(1);
    expect(result[0].incidenId).toStrictEqual('iid-1');
  });
});

describe('Create Single message', () => {
  test('Return created message: Nominal Scenario', async () => {
    let expectedMessage = {
      message: 'message',
      senderId: 'id1',
      incidenId: 'iid-2',
    };
    const createMock = jest
      .spyOn(TestDBClient.prototype, 'create')
      .mockImplementation(() => {
        return expectedMessage;
      });
    let result = await groupDao.create(expectedMessage);

    expect(createMock).toBeCalledTimes(1);
    expect(result.incidenId).toStrictEqual('iid-2');
  });
});

describe('Fetch all group messages ReadAll', () => {
  test('Return All group messages: Nominal Scenario', async () => {
    const readAllMock = jest
      .spyOn(TestDBClient.prototype, 'readAll')
      .mockImplementation(() => {
        return [{ message: 'message', senderId: 'id1', incidenId: 'iid-1' }];
      });
    let result = await groupDao.readAll({}, {}, 10, 1);

    expect(readAllMock).toBeCalledTimes(1);
    expect(result[0].senderId).toStrictEqual('id1');
  });
});

describe('Delete single or many message', () => {
  test('delete single or many: Nominal Scenario', async () => {
    const deleteMock = jest
      .spyOn(TestDBClient.prototype, 'delete')
      .mockImplementation(() => {
        return { deletedCount: 5 };
      });
    let deleteResult = await groupDao.delete('id-1');

    expect(deleteMock).toBeCalledTimes(1);
    expect(deleteResult.deletedCount).toStrictEqual(5);
  });
});

describe('Update A group message', () => {
  test('Return updated doc: Nominal Scenario', async () => {
    const expectedDocument = {
      message: 'message',
      senderId: 'id1',
      sentimentId: 'sid-2',
    };
    const updateMock = jest
      .spyOn(TestDBClient.prototype, 'update')
      .mockImplementation(() => {
        return expectedDocument;
      });
    let result = await groupDao.update(
      { senderId: 'id1' },
      { sentimentId: 'sid-3' },
      {},
    );

    expect(updateMock).toBeCalledTimes(1);
    expect(result).toStrictEqual(expectedDocument);
  });
});

//
