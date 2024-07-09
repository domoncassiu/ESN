import DAO from './DAO.js';
import SchemaEnum from '../clients/SchemaEnum.js';

export default class GroupMessageDAO extends DAO {
  constructor(dbClient) {
    super(dbClient);
  }

  async create(message) {
    return this.dbClient.create(SchemaEnum.GROUPMESSAGE, message);
  }

  async read(filter) {
    return await this.dbClient.read(SchemaEnum.GROUPMESSAGE, filter);
  }

  async readAll(condition, sort) {
    return await this.dbClient.readAll(
      SchemaEnum.GROUPMESSAGE,
      condition,
      sort,
    );
  }

  async readAllWithPagination(condition, sort, pageSize, page) {
    return await this.dbClient.readAllWithPagination(
      SchemaEnum.GROUPMESSAGE,
      condition,
      sort,
      pageSize,
      page,
    );
  }

  async update(filter, update, options) {
    return await this.dbClient.update(
      SchemaEnum.GROUPMESSAGE,
      filter,
      update,
      options,
    );
  }

  async updateMany(filter, update, options) {
    return await this.dbClient.updateMany(
      SchemaEnum.GROUPMESSAGE,
      filter,
      update,
      options,
    );
  }

  // TODO: what's the identifier for deleting msg
  async delete(_id) {
    return await this.dbClient.delete(SchemaEnum.GROUPMESSAGE, _id);
  }
}
