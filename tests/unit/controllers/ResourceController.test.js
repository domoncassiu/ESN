import ResourceController from '../../../controllers/ResourceController.js';
import Resource from '../../../models/Resource.js';
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import TestDbClient from '../../../bin/State.js';
import State from '../../../bin/State.js';
describe('ResourceController', () => {
  let dbClient;
  let resourceController;
  beforeAll(() => {
    dbClient = TestDbClient.getInstance();
    resourceController = new ResourceController(dbClient);
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('fetchAllResources fetches all resources successfully', async () => {
    const mockResources = [{ id: 'resource-uuid', name: 'Water' }];
    Resource.fetchAllResources = jest.fn().mockResolvedValue(mockResources);
    const result = await resourceController.fetchAllResources(1, 10, true);
    expect(Resource.fetchAllResources).toHaveBeenCalled();
    expect(result).toEqual(mockResources);
  });

  test('deleteResourceById successfully deletes a resource', async () => {
    Resource.deleteThisResource = jest.fn().mockResolvedValue({});
    const result = await resourceController.deleteResourceById(
      'resource',
      'resource-uuid',
    );
    expect(Resource.deleteThisResource).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Resource successfully deleted.' });
  });

  test('fetchResourceById fetches a resource successfully', async () => {
    const mockResource = { id: 'resource-uuid', name: 'Water' };
    Resource.fetchResourceById = jest.fn().mockResolvedValue(mockResource);
    const result = await resourceController.fetchResourceById('resource-uuid');
    expect(Resource.fetchResourceById).toHaveBeenCalled();
    expect(result).toEqual(mockResource);
  });

  test('addNewResource throws error when required data is missing', async () => {
    const incompleteResourceData = { name: '', quantity: 100 };

    await expect(
      resourceController.addNewResource(
        ...Object.values(incompleteResourceData),
      ),
    ).rejects.toThrow('Internal Server Error');
  });

  test('fetchAllResources supports pagination correctly', async () => {
    const mockResourcesPage1 = [
      { id: 'resource-uuid-1', name: 'Water' },
      { id: 'resource-uuid-2', name: 'Food' },
    ];
    const mockResourcesPage2 = [{ id: 'resource-uuid-3', name: 'Medicine' }];
    Resource.fetchAllResources = jest
      .fn()
      .mockResolvedValueOnce(mockResourcesPage1)
      .mockResolvedValueOnce(mockResourcesPage2);

    const resultPage1 = await resourceController.fetchAllResources(1, 2, true);
    const resultPage2 = await resourceController.fetchAllResources(2, 1, true);

    expect(Resource.fetchAllResources).toHaveBeenCalledTimes(2);
    expect(resultPage1).toEqual(mockResourcesPage1);
    expect(resultPage2).toEqual(mockResourcesPage2);
  });
  test('addNewResource successfully adds a new resource', async () => {
    const newResourceData = {
      name: 'Food',
      quantity: 100,
      location: '123 Main St',
      additionalInfo: 'Urgently needed',
      user: 'John Doe',
    };
    const mockResource = new Resource(
      dbClient,
      'unique-uuid',
      ...Object.values(newResourceData),
      Date.now(),
    );
    Resource.prototype.insertThisResource = jest
      .fn()
      .mockResolvedValue(mockResource);
    State.getInstance = jest.fn().mockReturnValue({
      websocketSubsystem: {
        sendResourceRequest: jest.fn().mockResolvedValue({}),
      },
    });
    const result = await resourceController.addNewResource(
      ...Object.values(newResourceData),
    );
    expect(Resource.prototype.insertThisResource).toHaveBeenCalled();
    expect(
      State.getInstance().websocketSubsystem.sendResourceRequest,
    ).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Resource);
  });
});
