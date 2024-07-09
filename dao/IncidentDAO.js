import DAO from './DAO.js';
import SchemaEnum from '../clients/SchemaEnum.js';

export default class IncidentDAO extends DAO {
  constructor(dbClient) {
    super(dbClient);
  }

  async create(incident) {
    return this.dbClient.create(SchemaEnum.INCIDENT, incident);
  }

  async read(filter) {
    return await this.dbClient.read(SchemaEnum.INCIDENT, filter);
  }

  async readAll(condition, sort) {
    return await this.dbClient.readAll(SchemaEnum.INCIDENT, condition, sort);
  }

  async readAllWithPagination(condition, sort, pageSize, page) {
    return await this.dbClient.readAllWithPagination(
      SchemaEnum.INCIDENT,
      condition,
      sort,
      pageSize,
      page,
    );
  }

  async update(filter, update, options) {
    return await this.dbClient.update(
      SchemaEnum.INCIDENT,
      filter,
      update,
      options,
    );
  }

  async delete(incidentId) {
    return await this.dbClient.delete(SchemaEnum.INCIDENT, incidentId);
  }
}
