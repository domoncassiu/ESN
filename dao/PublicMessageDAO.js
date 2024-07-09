import DAO from './DAO.js';
import SchemaEnum from '../clients/SchemaEnum.js';

class PublicMessageDAO extends DAO {
  constructor(dbClient) {
    super(dbClient);
  }

  async create(message) {
    return this.dbClient.create(SchemaEnum.PUBLICMESSAGE, message);
  }

  // async read(filter) {
  //   return await this.dbClient.read(SchemaEnum.PUBLICMESSAGE, filter);
  // }

  // async readAll(condition, sort) {
  //   return await this.dbClient.readAll(
  //     SchemaEnum.PUBLICMESSAGE,
  //     condition,
  //     sort,
  //   );
  // }

  async readAllWithPagination(condition, sort, pageSize, page) {
    return await this.dbClient.readAllWithPagination(
      SchemaEnum.PUBLICMESSAGE,
      condition,
      sort,
      pageSize,
      page,
    );
  }

  // async update(filter, update, options) {
  //   return await this.dbClient.update(
  //     SchemaEnum.PUBLICMESSAGE,
  //     filter,
  //     update,
  //     options,
  //   );
  // }

  // // TODO: what's the identifier for deleting msg
  // async delete(_id) {
  //   return await this.dbClient.delete(SchemaEnum.PUBLICMESSAGE, _id);
  // }
}

export default PublicMessageDAO;
