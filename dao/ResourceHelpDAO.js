import DAO from './DAO.js';
import SchemaEnum from '../clients/SchemaEnum.js';

class ResourceHelpDAO extends DAO {
  constructor(dbClient) {
    super(dbClient);
  }

  async create(resourceHelp) {
    return this.dbClient.create(SchemaEnum.RESOURCEHELPSCHEMA, resourceHelp);
  }

  async delete(resourceHelpId) {
    return this.dbClient.delete(SchemaEnum.RESOURCEHELPSCHEMA, {
      _id: resourceHelpId,
    });
  }
}

export default ResourceHelpDAO;
