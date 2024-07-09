import ShelterReviewDAO from '../dao/ShelterReviewDAO.js';
import DatabaseError from '../exceptions/DatabaseError.js';

class ShelterReview {
  shelterReviewDAO = null;
  constructor(dbClient, location, ratings, reviewer, message, timestamp) {
    this.dbClient = dbClient;
    this.location = location;
    this.ratings = ratings;
    (this.reviewer = reviewer), (this.message = message);
    this.timestamp = timestamp;
    this.shelterReviewDAO = new ShelterReviewDAO(dbClient);
  }

  static async fetchAllReviews(
    dbClient,
    page = 1,
    pageSize = 50,
    ascending = false,
    condition = {},
  ) {
    const order = ascending ? 1 : -1;
    try {
      return await new ShelterReviewDAO(dbClient).readAllWithPagination(
        condition,
        { createdAt: order },
        pageSize,
        page,
      );
    } catch (err) {
      console.error(err);
      throw new DatabaseError();
    }
  }

  static async fetchAllShelters(dbClient, aggregation = []) {
    try {
      return await new ShelterReviewDAO(dbClient).readAllWithAggregate(
        aggregation,
      );
    } catch (err) {
      console.error(err);
      throw new DatabaseError();
    }
  }

  async insertThisReview() {
    try {
      return await this.shelterReviewDAO.create(this);
    } catch (err) {
      throw new DatabaseError();
    }
  }

  static async updateMessage(dbClient, username, id, message) {
    try {
      return await new ShelterReviewDAO(dbClient).update(username, id, message);
    } catch (err) {
      throw new DatabaseError();
    }
  }

  static async deleteReview(dbClient, id) {
    try {
      return await new ShelterReviewDAO(dbClient).delete(id);
    } catch (err) {
      console.log(err);
      throw new DatabaseError();
    }
  }
}

export default ShelterReview;
