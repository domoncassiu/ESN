import { jest } from '@jest/globals';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDBClient from '../../../clients/TestDBClient';
import ShelterReviewDAO from '../../../dao/ShelterReviewDAO';

let reviewDao = new ShelterReviewDAO(TestDBClient.getInstance());

describe('Fetch Many reviews with pagination', () => {
  test('Return Many reviews: Nominal Scenario', async () => {
    const readAllWithPaginationMock = jest
      .spyOn(TestDBClient.prototype, 'readAllWithPagination')
      .mockImplementation(() => {
        return [
          { location: 'Sunnyvale', reviewer: 'mary', message: 'message' },
        ];
      });
    let result = await reviewDao.readAllWithPagination({}, {}, 10, 1);

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readAllWithPaginationMock).toBeCalledTimes(1);
    expect(result[0].reviewer).toStrictEqual('mary');
  });
});

describe('Create Single review', () => {
  test('Return created review: Nominal Scenario', async () => {
    let expectedReview = {
      location: 'Sunnyvale',
      reviewer: 'bob',
      message: 'message',
    };
    const createMock = jest
      .spyOn(TestDBClient.prototype, 'create')
      .mockImplementation(() => {
        return expectedReview;
      });
    let result = await reviewDao.create(expectedReview);

    expect(createMock).toBeCalledTimes(1);
    expect(result.reviewer).toStrictEqual('bob');
  });
});

describe('Delete single or many reviews', () => {
  test('delete single or many reviews: Nominal Scenario', async () => {
    const deleteMock = jest
      .spyOn(TestDBClient.prototype, 'delete')
      .mockImplementation(() => {
        return { deletedCount: 5 };
      });
    let deleteResult = await reviewDao.delete('id-1');

    expect(deleteMock).toBeCalledTimes(1);
    expect(deleteResult.deletedCount).toStrictEqual(5);
  });
});

describe('Update A Review', () => {
  test('Return updated doc: Nominal Scenario', async () => {
    const expectedDocument = {
      location: 'Sunnyvale',
      reviewer: 'bob',
      message: 'new message',
    };
    const updateMock = jest
      .spyOn(TestDBClient.prototype, 'update')
      .mockImplementation(() => {
        return expectedDocument;
      });
    let result = await reviewDao.update('bob', 'id-2', 'new message');

    expect(updateMock).toBeCalledTimes(1);
    expect(result.message).toStrictEqual('new message');
  });
});

describe('Fetch Many reviews with aggregate', () => {
  test('Return Many reviews: Nominal Scenario', async () => {
    const readAllWithAggregateMock = jest
      .spyOn(TestDBClient.prototype, 'readAllWithAggregate')
      .mockImplementation(() => {
        return [
          { location: 'Sunnyvale', reviewer: 'mary', message: 'message' },
        ];
      });
    let result = await reviewDao.readAllWithAggregate({ reviewer: 'mary' });

    // Assert that dbClient.readAllWithPagination was called with correct arguments
    expect(readAllWithAggregateMock).toBeCalledTimes(1);
    expect(result[0].reviewer).toStrictEqual('mary');
  });
});
