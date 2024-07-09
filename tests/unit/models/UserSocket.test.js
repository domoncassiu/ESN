import { expect, jest, test } from '@jest/globals';
import UserSocketDAO from '../../../dao/UserSocketDAO';
import TestDBClient from '../../../clients/TestDBClient';
import UserSocket from '../../../models/UserSocket';

// Mock functions
let deleteSocket = jest
  .spyOn(UserSocketDAO.prototype, 'delete')
  .mockImplementation(() => true);
let update = jest
  .spyOn(UserSocketDAO.prototype, 'update')
  .mockImplementation(() => true);
let socket = new UserSocket(TestDBClient.getInstance(), 'mary', '12345');

describe('Testing Model: UserSocket', () => {
  test('Testing deletion: deleteThisUserSocketId', async () => {
    await socket.deleteThisUserSocketId();
    expect(deleteSocket).toBeCalledTimes(1);
  });
  test('Testing deletion: updateThisUserSocketId', async () => {
    await socket.updateThisUserSocketId();
    expect(update).toBeCalledTimes(1);
  });
});
