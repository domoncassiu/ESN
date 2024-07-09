import DAO from './DAO.js';
import SchemaEnum from '../clients/SchemaEnum.js';

class OnlineStatusDAO extends DAO {
  constructor(dbClient) {
    super(dbClient);
  }

  // async create(status) {
  //   return this.dbClient.create(SchemaEnum.ONLINESTATUS, status);
  // }

  async read(filter) {
    return await this.dbClient.read(SchemaEnum.ONLINESTATUS, filter);
  }

  async readAll(order, pageSize, page) {
    return await this.dbClient.readAll(
      SchemaEnum.ONLINESTATUS,
      order,
      pageSize,
      page,
    );
  }

  async update(filter, update, options) {
    return await this.dbClient.update(
      SchemaEnum.ONLINESTATUS,
      filter,
      update,
      options,
    );
  }

  // async delete(username) {
  //   return await this.dbClient.delete(SchemaEnum.ONLINESTATUS, username);
  // }
}

export default OnlineStatusDAO;
