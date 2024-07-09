import DAO from './DAO.js';
import SchemaEnum from '../clients/SchemaEnum.js';

class CommentDAO extends DAO {
  constructor(dbClient) {
    super(dbClient);
  }

  // read all for an album
  async readAllWithPagination(condition, sort, pageSize, page) {
    return await this.dbClient.readAllWithPagination(
      SchemaEnum.COMMENT,
      condition,
      sort,
      pageSize,
      page,
    );
  }

  // read for a singular image
  async read(filter) {
    return await this.dbClient.read(SchemaEnum.COMMENT, filter);
  }

  // create a single entry
  async create(comment) {
    return this.dbClient.create(SchemaEnum.COMMENT, comment);
  }

  async deleteMany(imageId) {
    return this.dbClient.delete(SchemaEnum.COMMENT, 'imageId', imageId);
  }
}

export default CommentDAO;
