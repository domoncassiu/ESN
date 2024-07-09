import DAO from './DAO.js';
import SchemaEnum from '../clients/SchemaEnum.js';

class UserDAO extends DAO {
  constructor(dbClient) {
    super(dbClient);
  }

  async create(user) {
    return this.dbClient.create(SchemaEnum.USER, user);
  }

  async read(filter) {
    return await this.dbClient.read(SchemaEnum.USER, filter);
  }

  async readAll(condition, sort) {
    return await this.dbClient.readAll(SchemaEnum.USER, condition, sort);
  }

  async readAllWithPagination(condition, sort, pageSize, page) {
    return await this.dbClient.readAllWithPagination(
      SchemaEnum.USER,
      condition,
      sort,
      pageSize,
      page,
    );
  }

  async update(filter, update, options) {
    return await this.dbClient.update(SchemaEnum.USER, filter, update, options);
  }

  async delete(username) {
    return await this.dbClient.delete(SchemaEnum.USER, username);
  }

  async deleteAll() {
    return await this.dbClient.deleteAll(SchemaEnum.USER);
  }
}

export default UserDAO;
