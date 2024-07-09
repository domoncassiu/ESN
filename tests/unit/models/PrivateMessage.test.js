import { expect, jest, test } from '@jest/globals';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDbClient from '../../../bin/State';
import PrivateMessageDAO from '../../../dao/PrivateMessageDAO';
import SafetyStatusEnum from '../../../models/SafetyStatusEnum';
import PrivateMessage from '../../../models/PrivateMessage';

let readAllWithPagination = jest
  .spyOn(PrivateMessageDAO.prototype, 'readAllWithPagination')
  .mockImplementation(() => {
    return [
      {
        messageId: '4aa05683-d8b6-4d77-99a1-d613041af550',
        sender: 'user1',
        message: 'test',
        safetyStatus: SafetyStatusEnum.OK,
        receiver: 'user2',
        readStatus: 'Read',
        timestamp: 1711164262197,
      },
    ];
  });

let create = jest
  .spyOn(PrivateMessageDAO.prototype, 'create')
  .mockResolvedValue();

describe('Fetch All Private Messages', () => {
  test('Return all private messages between 2 users: Nominal Scenario', async () => {
    const dbClient = TestDbClient.getInstance();
    const condition = {
      $or: [
        { sender: 'user1', receiver: 'user2' },
        { sender: 'user2', receiver: 'user1' },
      ],
    };
    const result = await PrivateMessage.fetchAllPrivateMessages(
      dbClient,
      1,
      50,
      true,
      condition,
    );
    expect(readAllWithPagination).toBeCalledTimes(1);
    expect(result).toEqual([
      {
        messageId: '4aa05683-d8b6-4d77-99a1-d613041af550',
        sender: 'user1',
        message: 'test',
        safetyStatus: SafetyStatusEnum.OK,
        receiver: 'user2',
        readStatus: 'Read',
        timestamp: 1711164262197,
      },
    ]);
  });

  test('DAO object ran into database related error', async () => {
    const dbClient = TestDbClient.getInstance();
    const condition = {
      $or: [
        { sender: 'user1', receiver: 'user2' },
        { sender: 'user2', receiver: 'user1' },
      ],
    };
    let readAllWithPagination = jest
      .spyOn(PrivateMessageDAO.prototype, 'readAllWithPagination')
      .mockRejectedValueOnce(new DatabaseError());
    expect(readAllWithPagination).toBeCalledTimes(1);
    await expect(() =>
      PrivateMessage.fetchAllPrivateMessages(dbClient, 1, 50, true, condition),
    ).rejects.toThrow(DatabaseError);
  });
});

describe('Insert Private Message', () => {
  test('Insert single private message: Nominal Scenario', async () => {
    const dbClient = TestDbClient.getInstance();
    const testMessage = new PrivateMessage(
      dbClient,
      '1',
      'sender1',
      'somemessage',
      SafetyStatusEnum.OK,
      Date.now(),
      'user2',
      'Unread',
    );
    await testMessage.insertThisMessage();

    expect(create).toBeCalledTimes(1);
    expect(create).toBeCalledWith(testMessage);
  });

  test('DAO object ran into database related error', async () => {
    const dbClient = TestDbClient.getInstance();
    const testMessage = new PrivateMessage(
      dbClient,
      '1',
      'sender1',
      'somemessage',
      SafetyStatusEnum.OK,
      Date.now(),
      'user2',
      'Unread',
    );
    let create = jest
      .spyOn(PrivateMessageDAO.prototype, 'create')
      .mockRejectedValueOnce(new DatabaseError());
    expect(create).toBeCalledTimes(1);
    await expect(() => testMessage.insertThisMessage()).rejects.toThrow(
      DatabaseError,
    );
  });
});
