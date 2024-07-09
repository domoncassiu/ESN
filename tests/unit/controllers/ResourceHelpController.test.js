import ResourceHelpController from '../../../controllers/ResourceHelpController.js';
import ResourceHelp from '../../../models/ResourceHelp.js';
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import TestDbClient from '../../../bin/State.js';

describe('ResourceHelpController', () => {
  let dbClient;
  let resourceHelpController;

  beforeAll(() => {
    dbClient = TestDbClient.getInstance();
    resourceHelpController = new ResourceHelpController(dbClient);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('addNewResourceHelp successfully adds a resource help', async () => {
    // Setup
    const mockResourceHelp = {
      id: 'unique-uuid',
      resource: 'Water',
      helper: 'John Doe',
      quantityOffered: 10,
      address: '123 Main St',
    };
    ResourceHelp.prototype.insertThisResourceHelp = jest
      .fn()
      .mockResolvedValue(mockResourceHelp);
    const result = await resourceHelpController.addNewResourceHelp(
      'Water',
      'John Doe',
      10,
      '123 Main St',
    );
    // expect(uuid).toHaveBeenCalled();
    // expect(logSpy).toHaveBeenCalledWith('Water', 'John Doe', 10, '123 Main St');
    expect(ResourceHelp.prototype.insertThisResourceHelp).toHaveBeenCalled();
    expect(result).toBeInstanceOf(ResourceHelp);
  });
  test('addNewResourceHelp throws InternalServerError on failure', async () => {
    ResourceHelp.prototype.insertThisResourceHelp = jest
      .fn()
      .mockRejectedValue(new Error('Database Error'));
    await expect(
      resourceHelpController.addNewResourceHelp(
        'Water',
        'John Doe',
        10,
        '123 Main St',
      ),
    ).rejects.toThrow('Internal Server Error');
  });
  test('addNewResourceHelp validates input parameters', async () => {
    const action = async () =>
      await resourceHelpController.addNewResourceHelp(
        '',
        'John Doe',
        10,
        '123 Main St',
      );
    await expect(action).rejects.toThrow('Internal Server Error');
  });
});
