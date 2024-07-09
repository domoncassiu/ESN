import { expect, jest, test } from '@jest/globals';
import ShelterReviewController from '../../../controllers/ShelterReviewController';
import TestDBClient from '../../../clients/TestDBClient';
import ShelterReview from '../../../models/ShelterReview';
import DatabaseError from '../../../exceptions/DatabaseError';
import InternalServerError from '../../../exceptions/InternalServerError';

let shelterReviewController = new ShelterReviewController(
  TestDBClient.getInstance(),
);

// Mock functions
let insertThisReview = jest
  .spyOn(ShelterReview.prototype, 'insertThisReview')
  .mockReturnValue(undefined);

let deleteReview = jest
  .spyOn(ShelterReview, 'deleteReview')
  .mockReturnValue(undefined);

let updateMessage = jest
  .spyOn(ShelterReview, 'updateMessage')
  .mockReturnValue(undefined);

let fetchAllReviews = jest
  .spyOn(ShelterReview, 'fetchAllReviews')
  .mockReturnValue([
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

let fetchAllShelters = jest
  .spyOn(ShelterReview, 'fetchAllShelters')
  .mockImplementation(() => [
    {
      _id: 'test location',
      overall: 5,
      cleanliness: 5,
      amenities: 5,
      capacity: 5,
      communication: 5,
    },
  ]);

describe('Testing controller: ShelterReviewController', () => {
  test('Publish an review: addNewReview', async () => {
    const ratings = {
      overall: 5,
      cleanliness: 5,
      amenities: 5,
      capacity: 5,
      communication: 5,
    };
    let review = await shelterReviewController.addNewReview(
      'user1',
      ratings,
      'test',
      'test location',
    );
    expect(insertThisReview).toBeCalledTimes(1);
  });
  test('Fetch all reviews for a location: fetchAllReviewsForLocation', async () => {
    let reviews =
      await shelterReviewController.fetchAllReviewsForLocation('test location');
    expect(fetchAllReviews).toBeCalledTimes(1);
    expect(reviews).toStrictEqual([
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
  test('Fetch all reviews for a location: fetchAllSheltersWithReviews', async () => {
    let shelters = await shelterReviewController.fetchAllSheltersWithReviews();
    expect(fetchAllShelters).toBeCalledTimes(1);
    expect(shelters).toStrictEqual([
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
  test('Rejects with an internal server error: fetchAllSheltersWithReviews', async () => {
    let fetchAllShelters = jest
      .spyOn(ShelterReview, 'fetchAllShelters')
      .mockRejectedValueOnce(new DatabaseError());
    expect(fetchAllShelters).toBeCalledTimes(1);
    await expect(() =>
      shelterReviewController.fetchAllSheltersWithReviews(),
    ).rejects.toThrow(InternalServerError);
  });
  test('Update a review: updateReview', async () => {
    await shelterReviewController.updateReview();
    expect(updateMessage).toBeCalledTimes(1);
  });
  test('Rejects with an internal server error: deleteReview', async () => {
    let updateMessage = jest
      .spyOn(ShelterReview, 'updateMessage')
      .mockRejectedValueOnce(new DatabaseError());
    expect(updateMessage).toBeCalledTimes(1);
    await expect(() => shelterReviewController.updateReview()).rejects.toThrow(
      InternalServerError,
    );
  });
  test('Delete a review: deleteReview', async () => {
    await shelterReviewController.deleteReview();
    expect(deleteReview).toBeCalledTimes(1);
  });
  test('Rejects with an internal server error: deleteReview', async () => {
    let deleteReview = jest
      .spyOn(ShelterReview, 'deleteReview')
      .mockRejectedValueOnce(new DatabaseError());
    expect(deleteReview).toBeCalledTimes(1);
    await expect(() => shelterReviewController.deleteReview()).rejects.toThrow(
      InternalServerError,
    );
  });
});
