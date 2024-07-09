import DAO from './DAO.js';
import SchemaEnum from '../clients/SchemaEnum.js';

class UserSocketDAO extends DAO {
  constructor(dbClient) {
    super(dbClient);
  }

  async create(usersocket) {
    return this.dbClient.create(SchemaEnum.USERSOCKET, usersocket);
  }

  async read(filter) {
    return await this.dbClient.read(SchemaEnum.USERSOCKET, filter);
  }
  async update(filter, update, options) {
    return this.dbClient.update(SchemaEnum.USERSOCKET, filter, update, options);
  }

  async delete(username) {
    return this.dbClient.delete(SchemaEnum.USERSOCKET, 'username', username);
  }
}

export default UserSocketDAO;
