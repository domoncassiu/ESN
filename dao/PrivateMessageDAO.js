import DAO from './DAO.js';
import SchemaEnum from '../clients/SchemaEnum.js';

class PrivateMessageDAO extends DAO {
  constructor(dbClient) {
    super(dbClient);
  }

  async create(message) {
    return this.dbClient.create(SchemaEnum.PRIVATEMESSAGE, message);
  }

  // async read(filter) {
  //   return await this.dbClient.read(SchemaEnum.PRIVATEMESSAGE, filter);
  // }

  // async readAll(condition, sort) {
  //   return await this.dbClient.readAll(
  //     SchemaEnum.PRIVATEMESSAGE,
  //     condition,
  //     sort,
  //   );
  // }

  async readAllWithPagination(condition, sort, pageSize, page) {
    return await this.dbClient.readAllWithPagination(
      SchemaEnum.PRIVATEMESSAGE,
      condition,
      sort,
      pageSize,
      page,
    );
  }

  // async update(filter, update, options) {
  //   return await this.dbClient.update(
  //     SchemaEnum.PRIVATEMESSAGE,
  //     filter,
  //     update,
  //     options,
  //   );
  // }

  async updateMany(filter, update, options) {
    return await this.dbClient.updateMany(
      SchemaEnum.PRIVATEMESSAGE,
      filter,
      update,
      options,
    );
  }

  // // TODO: what's the identifier for deleting msg
  // async delete(_id) {
  //   return await this.dbClient.delete(SchemaEnum.PRIVATEMESSAGE, _id);
  // }
}

export default PrivateMessageDAO;
