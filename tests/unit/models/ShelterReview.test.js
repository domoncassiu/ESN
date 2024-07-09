import { jest } from '@jest/globals';
import ShelterReview from '../../../models/ShelterReview';
import DatabaseError from '../../../exceptions/DatabaseError';
import TestDbClient from '../../../bin/State';
import ShelterReviewDAO from '../../../dao/ShelterReviewDAO';

let readAllWithPagination = jest
  .spyOn(ShelterReviewDAO.prototype, 'readAllWithPagination')
  .mockImplementation(() => {
    return [
      {
        location: 'test location',
        ratings: {
          overall: 5,
          cleanliness: 5,
          amenities: 5,
          capacity: 5,
          communication: 5,
        },
        reviewer: 'user1',
        message: 'test',
        timestamp: 1711164262197,
      },
    ];
  });

let readAllWithAggregate = jest
  .spyOn(ShelterReviewDAO.prototype, 'readAllWithAggregate')
  .mockImplementation(() => {
    return [
      {
        _id: 'test location',
        overall: 5,
        cleanliness: 5,
        amenities: 5,
        capacity: 5,
        communication: 5,
      },
    ];
  });

let update = jest
  .spyOn(ShelterReviewDAO.prototype, 'update')
  .mockImplementation(() => {
    return [
      {
        _id: 'test location',
        overall: 5,
        cleanliness: 5,
        amenities: 5,
        capacity: 5,
        communication: 5,
      },
    ];
  });

let deleteMock = jest
  .spyOn(ShelterReviewDAO.prototype, 'delete')
  .mockImplementation(() => {
    return null;
  });

let create = jest
  .spyOn(ShelterReviewDAO.prototype, 'create')
  .mockResolvedValue();

describe('Fetch All Shelter Reviews', () => {
  test('Return all shelter reviews: Nominal Scenario', async () => {
    const dbClient = TestDbClient.getInstance();
    const result = await ShelterReview.fetchAllReviews(dbClient);
    expect(readAllWithPagination).toBeCalledTimes(1);
    expect(result).toEqual([
      {
        location: 'test location',
        ratings: {
          overall: 5,
          cleanliness: 5,
          amenities: 5,
          capacity: 5,
          communication: 5,
        },
        reviewer: 'user1',
        message: 'test',
        timestamp: 1711164262197,
      },
    ]);
  });

  test('DAO object ran into database related error', async () => {
    const dbClient = TestDbClient.getInstance();
    let readAllWithPagination = jest
      .spyOn(ShelterReviewDAO.prototype, 'readAllWithPagination')
      .mockRejectedValueOnce(new DatabaseError());
    expect(readAllWithPagination).toBeCalledTimes(1);
    await expect(() => ShelterReview.fetchAllReviews(dbClient)).rejects.toThrow(
      DatabaseError,
    );
  });
});

describe('Fetch All Shelters with ratings', () => {
  test('Return all shelters with ratings: Nominal Scenario', async () => {
    const dbClient = TestDbClient.getInstance();
    const result = await ShelterReview.fetchAllShelters(dbClient);
    expect(readAllWithAggregate).toBeCalledTimes(1);
    expect(result).toEqual([
      {
        _id: 'test location',
        overall: 5,
        cleanliness: 5,
        amenities: 5,
        capacity: 5,
        communication: 5,
      },
    ]);
  });

  test('DAO object ran into database related error', async () => {
    const dbClient = TestDbClient.getInstance();
    let readAllWithAggregate = jest
      .spyOn(ShelterReviewDAO.prototype, 'readAllWithAggregate')
      .mockRejectedValueOnce(new DatabaseError());
    expect(readAllWithAggregate).toBeCalledTimes(1);
    await expect(() =>
      ShelterReview.fetchAllShelters(dbClient),
    ).rejects.toThrow(DatabaseError);
  });
});

describe('Update a review', () => {
  test('Update a review: Nominal Scenario', async () => {
    const dbClient = TestDbClient.getInstance();
    const result = await ShelterReview.updateMessage(
      dbClient,
      'user',
      'id',
      'message',
    );
    expect(update).toBeCalledTimes(1);
    expect(result).toEqual([
      {
        _id: 'test location',
        overall: 5,
        cleanliness: 5,
        amenities: 5,
        capacity: 5,
        communication: 5,
      },
    ]);
  });

  describe('Delete a review', () => {
    test('Update a review: Nominal Scenario', async () => {
      const dbClient = TestDbClient.getInstance();
      await ShelterReview.deleteReview(dbClient, 'id');
      expect(deleteMock).toBeCalledTimes(1);
    });

    test('DAO object ran into database related error', async () => {
      const dbClient = TestDbClient.getInstance();
      let deleteMock = jest
        .spyOn(ShelterReviewDAO.prototype, 'delete')
        .mockRejectedValueOnce(new DatabaseError());
      expect(update).toBeCalledTimes(1);
      await expect(() =>
        ShelterReview.deleteReview(dbClient, 'id'),
      ).rejects.toThrow(DatabaseError);
    });
  });

  test('DAO object ran into database related error', async () => {
    const dbClient = TestDbClient.getInstance();
    let update = jest
      .spyOn(ShelterReviewDAO.prototype, 'update')
      .mockRejectedValueOnce(new DatabaseError());
    expect(update).toBeCalledTimes(1);
    await expect(() =>
      ShelterReview.updateMessage(dbClient, 'user', 'id', 'message'),
    ).rejects.toThrow(DatabaseError);
  });
});

describe('Insert Review', () => {
  test('Insert one review: Nominal Scenario', async () => {
    const dbClient = TestDbClient.getInstance();
    const testReview = new ShelterReview(
      dbClient,
      'test location',
      {
        overall: 5,
        cleanliness: 5,
        amenities: 5,
        capacity: 5,
        communication: 5,
      },
      'user1',
      'somemessage',
      Date.now(),
    );
    await testReview.insertThisReview();

    expect(create).toBeCalledTimes(1);
    expect(create).toBeCalledWith(testReview);
  });

  test('DAO object ran into database related error', async () => {
    const dbClient = TestDbClient.getInstance();
    const testReview = new ShelterReview(
      dbClient,
      'test location',
      {
        overall: 5,
        cleanliness: 5,
        amenities: 5,
        capacity: 5,
        communication: 5,
      },
      'user1',
      'somemessage',
      Date.now(),
    );
    let create = jest
      .spyOn(ShelterReviewDAO.prototype, 'create')
      .mockRejectedValueOnce(new DatabaseError());
    expect(create).toBeCalledTimes(1);
    await expect(() => testReview.insertThisReview()).rejects.toThrow(
      DatabaseError,
    );
  });
});
