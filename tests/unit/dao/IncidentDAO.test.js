import { jest } from '@jest/globals';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDBClient from '../../../clients/TestDBClient';
import IncidentDAO from '../../../dao/IncidentDAO';

let incidentDao = new IncidentDAO(TestDBClient.getInstance());
const readMock = jest
  .spyOn(TestDBClient.prototype, 'read')
  .mockImplementation(() => {
    return { name: 'CMU Fire', membersList: ['mary', 'bob'] };
  });
describe('single read', () => {
  test('single Incident return: Nominal Scenario', async () => {
    let result = await incidentDao.read({});

    expect(readMock).toBeCalledTimes(1);
    expect(result).toStrictEqual({
      name: 'CMU Fire',
      membersList: ['mary', 'bob'],
    });
  });
});

describe('Fetch Many incidents with pagination', () => {
  test('Return all incidents: Nominal Scenario', async () => {
    const readAllWithPaginationMock = jest
      .spyOn(TestDBClient.prototype, 'readAllWithPagination')
      .mockImplementation(() => {
        return [{ name: 'CMU Fire', membersList: ['mary', 'bob'] }];
      });
    let result = await incidentDao.readAllWithPagination({}, {}, 10, 1);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readAllWithPaginationMock).toBeCalledTimes(1);
    expect(result[0].name).toStrictEqual('CMU Fire');
  });
});

describe('Create Single Incident', () => {
  test('Return created Incident: Nominal Scenario', async () => {
    let expectedIncident = { name: 'CMU Flood', membersList: ['mary', 'bob'] };
    const createMock = jest
      .spyOn(TestDBClient.prototype, 'create')
      .mockImplementation(() => {
        return expectedIncident;
      });
    let result = await incidentDao.create(expectedIncident);

    expect(createMock).toBeCalledTimes(1);
    expect(result.name).toStrictEqual('CMU Flood');
  });
});

describe('Fetch Incidents ReadAll', () => {
  test('Return All Incidents: Nominal Scenario', async () => {
    const readAllMock = jest
      .spyOn(TestDBClient.prototype, 'readAll')
      .mockImplementation(() => {
        return [{ name: 'CMU Flood', membersList: ['mary', 'bob'] }];
      });
    let result = await incidentDao.readAll({}, {});

    expect(readAllMock).toBeCalledTimes(1);
    expect(result[0].name).toStrictEqual('CMU Flood');
  });
});

describe('Delete Incidents', () => {
  test('delete Incidents: Nominal Scenario', async () => {
    const deleteMock = jest
      .spyOn(TestDBClient.prototype, 'delete')
      .mockImplementation(() => {
        return { deletedCount: 1 };
      });
    let deleteResult = await incidentDao.delete('iid-1');

    expect(deleteMock).toBeCalledTimes(1);
    expect(deleteResult.deletedCount).toStrictEqual(1);
  });
});

describe('Update A Incident', () => {
  test('Return updated doc: Nominal Scenario', async () => {
    const expectedDocument = {
      name: 'CMU Flood',
      membersList: ['mary', 'bob', 'newuser'],
    };
    const updateMock = jest
      .spyOn(TestDBClient.prototype, 'update')
      .mockImplementation(() => {
        return expectedDocument;
      });
    let result = await incidentDao.update(
      { name: 'CMU Flood' },
      { membersList: ['mary', 'bob', 'newuser'] },
      {},
    );

    expect(updateMock).toBeCalledTimes(1);
    expect(result.membersList).toStrictEqual(expectedDocument.membersList);
  });
});
