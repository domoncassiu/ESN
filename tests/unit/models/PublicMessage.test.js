import { expect, jest, test } from '@jest/globals';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDbClient from '../../../bin/State';
import PublicMessageDAO from '../../../dao/PublicMessageDAO';
import SafetyStatusEnum from '../../../models/SafetyStatusEnum';
import PublicMessage from '../../../models/PublicMessage';

let readAllWithPagination = jest
  .spyOn(PublicMessageDAO.prototype, 'readAllWithPagination')
  .mockImplementation(() => {
    return [
      {
        messageId: '4aa05683-d8b6-4d77-99a1-d613041af550',
        senderId: 'user1',
        message: 'test',
        safetyStatus: SafetyStatusEnum.OK,
        timestamp: 1711164262197,
      },
    ];
  });

let create = jest
  .spyOn(PublicMessageDAO.prototype, 'create')
  .mockResolvedValue();

describe('Fetch All Public Messages', () => {
  test('Return all messages: Nominal Scenario', async () => {
    const dbClient = TestDbClient.getInstance();
    const result = await PublicMessage.fetchAllPublicMessages(dbClient);
    expect(readAllWithPagination).toBeCalledTimes(1);
    expect(result).toEqual([
      {
        messageId: '4aa05683-d8b6-4d77-99a1-d613041af550',
        senderId: 'user1',
        message: 'test',
        safetyStatus: SafetyStatusEnum.OK,
        timestamp: 1711164262197,
      },
    ]);
  });

  test('DAO object ran into database related error', async () => {
    const dbClient = TestDbClient.getInstance();
    let readAllWithPagination = jest
      .spyOn(PublicMessageDAO.prototype, 'readAllWithPagination')
      .mockRejectedValueOnce(new DatabaseError());
    expect(readAllWithPagination).toBeCalledTimes(1);
    await expect(() =>
      PublicMessage.fetchAllMessages(dbClient),
    ).rejects.toThrow(DatabaseError);
  });
});

describe('Insert Announcement', () => {
  test('Insert single announcement: Nominal Scenario', async () => {
    const dbClient = TestDbClient.getInstance();
    const testMessage = new PublicMessage(
      dbClient,
      '1',
      'sender1',
      'somemessage',
      SafetyStatusEnum.OK,
      Date.now(),
    );
    await testMessage.insertThisMessage();

    expect(create).toBeCalledTimes(1);
    expect(create).toBeCalledWith(testMessage);
  });

  test('DAO object ran into database related error', async () => {
    const dbClient = TestDbClient.getInstance();
    const testMessage = new PublicMessage(
      dbClient,
      '1',
      'sender1',
      'somemessage',
      SafetyStatusEnum.OK,
      Date.now(),
    );
    let create = jest
      .spyOn(PublicMessageDAO.prototype, 'create')
      .mockRejectedValueOnce(new DatabaseError());
    expect(create).toBeCalledTimes(1);
    await expect(() => testMessage.insertThisMessage()).rejects.toThrow(
      DatabaseError,
    );
  });
});
