import { jest } from '@jest/globals';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDBClient from '../../../clients/TestDBClient';
import ShelterDAO from '../../../dao/ShelterDAO';

let shelterDao = new ShelterDAO(TestDBClient.getInstance());

describe('Fetch Many shelters with pagination', () => {
  test('Return all shelters: Nominal Scenario', async () => {
    const readAllWithPaginationMock = jest
      .spyOn(TestDBClient.prototype, 'readAllWithPagination')
      .mockImplementation(() => {
        return [{ shelterId: 'id-1', name: 'Sunnyvale', capacity: 30 }];
      });
    let result = await shelterDao.readAllWithPagination({}, {}, 10, 1);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readAllWithPaginationMock).toBeCalledTimes(1);
    expect(result[0].capacity).toStrictEqual(30);
  });
});

describe('Create Single shelter', () => {
  test('Return created shelter: Nominal Scenario', async () => {
    let expectedShelter = {
      shelterId: 'id-2',
      name: 'Sunnyvale',
      capacity: 30,
    };
    const createMock = jest
      .spyOn(TestDBClient.prototype, 'create')
      .mockImplementation(() => {
        return expectedShelter;
      });
    let result = await shelterDao.create(expectedShelter);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(createMock).toBeCalledTimes(1);
    expect(result.shelterId).toStrictEqual('id-2');
  });
});

describe('Delete shelter', () => {
  test('delete shelter: Nominal Scenario', async () => {
    const deleteMock = jest
      .spyOn(TestDBClient.prototype, 'delete')
      .mockImplementation(() => {
        return { deletedCount: 1 };
      });
    let deleteResult = await shelterDao.delete('Sunnyvale');

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(deleteMock).toBeCalledTimes(1);
    expect(deleteResult.deletedCount).toStrictEqual(1);
  });
});

describe('Update A shelter info', () => {
  test('Return updated doc: Nominal Scenario', async () => {
    const expectedDocument = {
      shelterId: 'id-2',
      name: 'Sunnyvale',
      capacity: 50,
    };
    const updateMock = jest
      .spyOn(TestDBClient.prototype, 'update')
      .mockImplementation(() => {
        return expectedDocument;
      });
    let result = await shelterDao.update(expectedDocument);

    expect(updateMock).toBeCalledTimes(1);
    expect(result).toStrictEqual(expectedDocument);
  });
});
