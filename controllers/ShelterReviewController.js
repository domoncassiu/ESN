import ShelterReview from '../models/ShelterReview.js';
import InternalServerError from '../exceptions/InternalServerError.js';
import InvalidEntryError from '../exceptions/InvalidEntryError.js';

class ShelterReviewController {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  async fetchAllReviewsForLocation(location) {
    return new Promise(async (resolve, reject) => {
      if (!location) {
        reject(new InternalServerError('No shelter location specified'));
      }
      const condition = { location: location };
      try {
        let reviews = await ShelterReview.fetchAllReviews(
          this.dbClient,
          1,
          500,
          true,
          condition,
        );

        resolve(reviews);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async fetchRatingsForLocation(location) {
    return new Promise(async (resolve, reject) => {
      if (!location) {
        reject(new InternalServerError('No shelter location specified'));
      }
      const aggregation = [
        { $match: { location: location } },

        {
          $group: {
            _id: '$location',
            overall: { $avg: '$ratings.overall' },
            cleanliness: { $avg: '$ratings.cleanliness' },
            amenities: { $avg: '$ratings.amenities' },
            capacity: { $avg: '$ratings.capacity' },
            communication: { $avg: '$ratings.communication' },
          },
        },
      ];
      try {
        let ratings = await ShelterReview.fetchAllShelters(
          this.dbClient,
          aggregation,
        );
        resolve(ratings);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async fetchAllSheltersWithReviews(
    filter, // {filteName, min, max}
    sortBy = 'overall',
    ascending = 'false',
  ) {
    return new Promise(async (resolve, reject) => {
      const sort = ascending === 'true' ? 1 : -1;
      console.log('sort', sort);
      let filterCondition = {};
      if (filter) {
        filterCondition[`${filter.filterName}`] = {
          $gte: Number(filter.min),
          $lte: Number(filter.max),
        };
      } else {
        filterCondition = { overall: { $gte: 0, $lte: 5 } };
      }
      console.log('condition', filterCondition);

      const aggregation = [
        {
          $group: {
            _id: '$location',
            overall: { $avg: '$ratings.overall' },
            cleanliness: { $avg: '$ratings.cleanliness' },
            amenities: { $avg: '$ratings.amenities' },
            capacity: { $avg: '$ratings.capacity' },
            communication: { $avg: '$ratings.communication' },
          },
        },
        {
          $match: filterCondition,
        },
        {
          $sort: { [sortBy]: sort, _id: 1 },
        },
      ];
      try {
        let shelters = await ShelterReview.fetchAllShelters(
          this.dbClient,
          aggregation,
        );

        resolve(shelters);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async addNewReview(reviewer, ratings, message, location) {
    return new Promise(async (resolve, reject) => {
      try {
        let review = new ShelterReview(
          this.dbClient,
          location,
          ratings,
          reviewer,
          message,
          Date.now(),
        );
        const response = await review.insertThisReview();
        resolve(response);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async updateReview(username, id, message) {
    return new Promise(async (resolve, reject) => {
      try {
        let review = await ShelterReview.updateMessage(
          this.dbClient,
          username,
          id,
          message,
        );
        resolve(review);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async deleteReview(id) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await ShelterReview.deleteReview(this.dbClient, id);
        resolve(result);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }
}

export default ShelterReviewController;
