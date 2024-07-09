import DAO from './DAO.js';
import SchemaEnum from '../clients/SchemaEnum.js';

class SafetyStatusDAO extends DAO {
  static instance;

  constructor(dbClient) {
    super(dbClient);
  }

  static getInstance(dbClient) {
    if (!this.instance) {
      this.instance = new SafetyStatusDAO(dbClient);
    }
    return this.instance;
  }

  async create(status) {
    return this.dbClient.create(SchemaEnum.SAFETYSTATUS, status);
  }

  async read(filter, options) {
    return await this.dbClient.read(SchemaEnum.SAFETYSTATUS, filter, options);
  }

  async readAll(order, pageSize, page) {
    return await this.dbClient.readAll(
      SchemaEnum.SAFETYSTATUS,
      order,
      pageSize,
      page,
    );
  }

  async readAllWithAggregate(aggregation) {
    return await this.dbClient.readAllWithAggregate(
      SchemaEnum.SAFETYSTATUS,
      aggregation,
    );
  }

  async readAllWithPagination(condition, sort, pageSize, page) {
    return await this.dbClient.readAllWithPagination(
      SchemaEnum.SAFETYSTATUS,
      condition,
      sort,
      pageSize,
      page,
    );
  }

  // async update(filter, update, options) {
  //   return await this.dbClient.update(
  //     SchemaEnum.SAFETYSTATUS,
  //     filter,
  //     update,
  //     options,
  //   );
  // }

  async delete(username) {
    return await this.dbClient.delete(SchemaEnum.SAFETYSTATUS, username);
  }

  async deleteAll() {
    return await this.dbClient.deleteAll(SchemaEnum.SAFETYSTATUS);
  }
}

export default SafetyStatusDAO;
