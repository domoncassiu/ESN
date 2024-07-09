import { jest } from '@jest/globals';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDBClient from '../../../clients/TestDBClient';
import UserDAO from '../../../dao/UserDAO';
import SchemaEnum from '../../../clients/SchemaEnum';

let userDao = new UserDAO(TestDBClient.getInstance());
const readMock = jest
  .spyOn(TestDBClient.prototype, 'read')
  .mockImplementation(() => {
    return { userId: 'id-1', username: 'mary', type: 'Citizen' };
  });
describe('single read', () => {
  test('single User return: Nominal Scenario', async () => {
    let result = await userDao.read({});

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readMock).toBeCalledTimes(1);
    expect(result).toStrictEqual({
      userId: 'id-1',
      username: 'mary',
      type: 'Citizen',
    });
  });
});

describe('Fetch Many users with pagination', () => {
  test('Return all safetystatuses: Nominal Scenario', async () => {
    const readAllWithPaginationMock = jest
      .spyOn(TestDBClient.prototype, 'readAllWithPagination')
      .mockImplementation(() => {
        return [{ userId: 'id-1', username: 'mary', type: 'Citizen' }];
      });
    let result = await userDao.readAllWithPagination({}, {}, 10, 1);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readAllWithPaginationMock).toBeCalledTimes(1);
    expect(result[0].username).toStrictEqual('mary');
  });
});

describe('Create Single user', () => {
  test('Return created user: Nominal Scenario', async () => {
    let expectedUser = { userId: 'id-1', username: 'mary', type: 'Citizen' };
    const createMock = jest
      .spyOn(TestDBClient.prototype, 'create')
      .mockImplementation(() => {
        return expectedUser;
      });
    let result = await userDao.create(expectedUser);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(createMock).toBeCalledTimes(1);
    expect(result.username).toStrictEqual('mary');
  });
});

describe('Fetch users ReadAll', () => {
  test('Return All Users: Nominal Scenario', async () => {
    const readAllMock = jest
      .spyOn(TestDBClient.prototype, 'readAll')
      .mockImplementation(() => {
        return [{ userId: 'id-1', username: 'mary', type: 'Citizen' }];
      });
    let result = await userDao.readAll({}, {}, 10, 1);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readAllMock).toBeCalledTimes(1);
    expect(result[0].username).toStrictEqual('mary');
  });
});

describe('Delete user (for testing)', () => {
  test('delete user: Nominal Scenario', async () => {
    const deleteMock = jest
      .spyOn(TestDBClient.prototype, 'delete')
      .mockImplementation(() => {
        return { deletedCount: 1 };
      });
    let deleteResult = await userDao.delete('id-1');

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(deleteMock).toBeCalledTimes(1);
    expect(deleteResult.deletedCount).toStrictEqual(1);
  });
});

describe('Delete all users (for testing)', () => {
  test('delete all users: Nominal Scenario', async () => {
    const deleteAllMock = jest
      .spyOn(TestDBClient.prototype, 'deleteAll')
      .mockImplementation(() => {
        return { deletedCount: 100 };
      });

    let deleteResult = await userDao.deleteAll();
    expect(deleteAllMock).toBeCalledTimes(1);
  });
});

describe('Update A user username', () => {
  test('Return updated doc: Nominal Scenario', async () => {
    const expectedDocument = { userId: 'id-1', username: 'bob' };
    const updateMock = jest
      .spyOn(TestDBClient.prototype, 'update')
      .mockImplementation(() => {
        return expectedDocument;
      });
    let result = await userDao.update(
      { userId: 'id-1' },
      { username: 'bob' },
      {},
    );

    expect(updateMock).toBeCalledTimes(1);
    expect(result).toStrictEqual(expectedDocument);
  });
});
