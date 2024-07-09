import DAO from './DAO.js';
import SchemaEnum from '../clients/SchemaEnum.js';

class ShelterReviewDAO extends DAO {
  constructor(dbClient) {
    super(dbClient);
  }

  async readAllWithPagination(condition, sort, pageSize, page) {
    return await this.dbClient.readAllWithPagination(
      SchemaEnum.SHELTERREVIEW,
      condition,
      sort,
      pageSize,
      page,
    );
  }

  async readAllWithAggregate(aggregation) {
    return await this.dbClient.readAllWithAggregate(
      SchemaEnum.SHELTERREVIEW,
      aggregation,
    );
  }

  async create(review) {
    return this.dbClient.create(SchemaEnum.SHELTERREVIEW, review);
  }

  async update(username, id, message) {
    try {
      return await this.dbClient.update(
        SchemaEnum.SHELTERREVIEW,
        { _id: id, reviewer: username },
        { message: message },
        {},
      );
    } catch (err) {
      console.log(err);
    }
  }

  async delete(id) {
    return await this.dbClient.delete(SchemaEnum.SHELTERREVIEW, '_id', id);
  }
}

export default ShelterReviewDAO;
