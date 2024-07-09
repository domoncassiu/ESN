import { jest } from '@jest/globals';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDBClient from '../../../clients/TestDBClient';
import ResourceHelpDAO from '../../../dao/ResourceHelpDAO';

let resourceHelpDao = new ResourceHelpDAO(TestDBClient.getInstance());

describe('Create Single resourceh help', () => {
  test('Return created resource help: Nominal Scenario', async () => {
    let expectedResourceHelp = { helper: 'mary', quantityOffered: 2 };
    const createMock = jest
      .spyOn(TestDBClient.prototype, 'create')
      .mockImplementation(() => {
        return expectedResourceHelp;
      });
    let result = await resourceHelpDao.create(expectedResourceHelp);

    expect(createMock).toBeCalledTimes(1);
    expect(result.helper).toStrictEqual('mary');
  });
});

describe('Delete single resource help', () => {
  test('delete single resource help: Nominal Scenario', async () => {
    const deleteMock = jest
      .spyOn(TestDBClient.prototype, 'delete')
      .mockImplementation(() => {
        return { deletedCount: 1 };
      });
    let deleteResult = await resourceHelpDao.delete('id-1');

    expect(deleteMock).toBeCalledTimes(1);
    expect(deleteResult.deletedCount).toStrictEqual(1);
  });
});
