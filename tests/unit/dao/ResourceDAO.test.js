import { jest } from '@jest/globals';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDBClient from '../../../clients/TestDBClient';
import ResourceDAO from '../../../dao/ResourceDAO';

let resourceDao = new ResourceDAO(TestDBClient.getInstance());

describe('Fetch Many resource req with pagination', () => {
  test('Return Many resource req: Nominal Scenario', async () => {
    const readAllWithPaginationMock = jest
      .spyOn(TestDBClient.prototype, 'readAllWithPagination')
      .mockImplementation(() => {
        return [{ name: 'water', location: 'carnegie', user: 'mary' }];
      });
    let result = await resourceDao.readAllWithPagination({}, {}, 10, 1);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readAllWithPaginationMock).toBeCalledTimes(1);
    expect(result[0].user).toStrictEqual('mary');
  });
});

describe('Create Single resource req', () => {
  test('Return created resource req: Nominal Scenario', async () => {
    let expectedResource = {
      name: 'water',
      location: 'carnegie',
      user: 'mary',
    };
    const createMock = jest
      .spyOn(TestDBClient.prototype, 'create')
      .mockImplementation(() => {
        return expectedResource;
      });
    let result = await resourceDao.create(expectedResource);

    expect(createMock).toBeCalledTimes(1);
    expect(result.location).toStrictEqual('carnegie');
  });
});

describe('Delete resource req', () => {
  test('delete resource req: Nominal Scenario', async () => {
    const deleteMock = jest
      .spyOn(TestDBClient.prototype, 'delete')
      .mockImplementation(() => {
        return { deletedCount: 1 };
      });
    let deleteResult = await resourceDao.delete('water', 'id-1');

    expect(deleteMock).toBeCalledTimes(1);
    expect(deleteResult.deletedCount).toStrictEqual(1);
  });
});

describe('Aggregate entries', () => {
  test('aggregate entries by criteria: Nominal Scenario', async () => {
    const aggregateMock = jest
      .spyOn(TestDBClient.prototype, 'aggregate')
      .mockImplementation(() => {
        return [{ name: 'water', location: 'carnegie', user: 'mary' }];
      });

    let result = await resourceDao.readById('66122c494dafa50ac4732dcc');
    expect(aggregateMock).toBeCalledTimes(1);
    expect(result[0].name).toStrictEqual('water');
  });
});
