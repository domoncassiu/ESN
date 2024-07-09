import {
  expect,
  jest,
  describe,
  beforeAll,
  afterAll,
  test,
} from '@jest/globals';
import AuthenticatedUser from '../../../models/AuthenticatedUser';
import UserDAO from '../../../dao/UserDAO';
import DatabaseError from '../../../exceptions/DatabaseError';
import InvalidEntryError from '../../../exceptions/InvalidEntryError';
import TestDBClient from '../../../clients/TestDBClient';
import UserType from '../../../models/UserType';

let update = jest.spyOn(UserDAO.prototype, 'update').mockImplementation(() => {
  return {
    lastErrorObject: { updatedExisting: true },
    value: 'something',
  };
});

let create = jest.spyOn(UserDAO.prototype, 'create').mockImplementation(() => {
  return { _id: 'id' };
});

let read = jest.spyOn(UserDAO.prototype, 'read').mockImplementation(() => {
  return { _id: 'id' };
});

let readAll = jest
  .spyOn(UserDAO.prototype, 'readAll')
  .mockImplementation(() => {
    return [];
  });

describe('updateAcknowledgeTermsStatus', () => {
  const dbClient = TestDBClient.getInstance();
  const newUser = new AuthenticatedUser(
    dbClient,
    'mary',
    '$2a$10$289FUpNF3M8LDzV2fl4ZtuEb2axpzYJUAPX8xQOBKLxGVWMjn/QoO',
    UserType.CITIZEN,
    false,
    true,
  );
  test('updateAcknowledgeTermsStatus: Nominal Scenario', async () => {
    let isUpdated = await newUser.updateAcknowledgeTermsStatus(true);
    expect(update).toBeCalledTimes(1);
  });

  test('DAO object ran into database related error', async () => {
    let update = jest
      .spyOn(UserDAO.prototype, 'update')
      .mockRejectedValueOnce(new DatabaseError());
    expect(update).toBeCalledTimes(1);
    await expect(() =>
      newUser.updateAcknowledgeTermsStatus(true),
    ).rejects.toThrow(DatabaseError);
  });
});

describe('insertThisUser', () => {
  const dbClient = TestDBClient.getInstance();
  const newUser = new AuthenticatedUser(
    dbClient,
    'mary',
    '$2a$10$289FUpNF3M8LDzV2fl4ZtuEb2axpzYJUAPX8xQOBKLxGVWMjn/QoO',
    UserType.CITIZEN,
    false,
    true,
    [],
    'id',
  );
  test('insertThisUser: Nominal Scenario', async () => {
    let result = await newUser.insertThisUser();
    expect(create).toBeCalledTimes(1);
    expect(read).toBeCalledTimes(1);
  });

  test('DAO object ran into database related error', async () => {
    let read = jest
      .spyOn(UserDAO.prototype, 'read')
      .mockRejectedValueOnce(new DatabaseError());
    expect(read).toBeCalledTimes(1);
    await expect(() => newUser.insertThisUser()).rejects.toThrow(DatabaseError);
  });
});

describe('getUserById', () => {
  const dbClient = TestDBClient.getInstance();
  test('getUserById: Nominal Scenario', async () => {
    let result = await AuthenticatedUser.getUserById(dbClient, 'id');
    expect(read).toBeCalled();
    expect(result).toEqual({ _id: 'id' });
  });

  test('DAO object ran into database related error', async () => {
    let read = jest
      .spyOn(UserDAO.prototype, 'read')
      .mockRejectedValueOnce(new DatabaseError());
    expect(read).toBeCalled();
    await expect(() =>
      AuthenticatedUser.getUserById(dbClient, 'id'),
    ).rejects.toThrow(DatabaseError);
  });
});

describe('getUserByUsername', () => {
  const dbClient = TestDBClient.getInstance();
  test('getUserByUsername: Nominal Scenario', async () => {
    let result = await AuthenticatedUser.getUserByUsername(
      dbClient,
      'username',
    );
    expect(read).toBeCalled();
    expect(result).toEqual({ _id: 'id' });
  });

  test('DAO object ran into database related error', async () => {
    let read = jest
      .spyOn(UserDAO.prototype, 'read')
      .mockRejectedValueOnce(new DatabaseError());
    expect(read).toBeCalled();
    await expect(() =>
      AuthenticatedUser.getUserByUsername(dbClient, 'username'),
    ).rejects.toThrow(DatabaseError);
  });
});

describe('updateUser', () => {
  const dbClient = TestDBClient.getInstance();
  test('updateUser: Nominal Scenario', async () => {
    await AuthenticatedUser.updateUser(
      dbClient,
      { _id: 'id' },
      { username: 'newname' },
    );
    expect(update).toBeCalled();
  });

  test('DAO object ran into database related error', async () => {
    let update = jest
      .spyOn(UserDAO.prototype, 'update')
      .mockRejectedValueOnce(new DatabaseError());
    expect(update).toBeCalled();
    await expect(() =>
      AuthenticatedUser.updateUser(
        dbClient,
        { _id: 'id' },
        { username: 'newname' },
      ),
    ).rejects.toThrow(DatabaseError);
  });
});

describe('findAllUsers', () => {
  const dbClient = TestDBClient.getInstance();
  test('findAllUsers: Nominal Scenario', async () => {
    const result = await AuthenticatedUser.findAllUsers({ type: 'Citizen' });
    expect(readAll).toBeCalled();
    expect(result).toEqual([]);
  });

  test('DAO object ran into database related error', async () => {
    let readAll = jest
      .spyOn(UserDAO.prototype, 'readAll')
      .mockRejectedValueOnce(new DatabaseError());
    expect(readAll).toBeCalled();
    await expect(() =>
      AuthenticatedUser.findAllUsers({ type: 'Citizen' }),
    ).rejects.toThrow(DatabaseError);
  });
});
