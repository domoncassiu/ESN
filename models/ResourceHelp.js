import ResourceHelpDAO from '../dao/ResourceHelpDAO.js';
import DatabaseError from '../exceptions/DatabaseError.js';

class ResourceHelp {
  constructor(
    dbClient,
    resourceHelpId,
    resource,
    helper,
    quantityOffered,
    address,
  ) {
    this.dbClient = dbClient;
    this.resourceHelpId = resourceHelpId;
    this.resource = resource;
    this.helper = helper;
    this.quantityOffered = quantityOffered;
    this.address = address;
    this.resourceHelpDAO = new ResourceHelpDAO(dbClient);
  }

  async insertThisResourceHelp() {
    try {
      await this.resourceHelpDAO.create({
        resource: this.resource,
        helper: this.helper,
        quantityOffered: this.quantityOffered,
        address: this.address,
      });
    } catch (err) {
      throw new DatabaseError();
    }
  }

  async deleteThisResourceHelp() {
    try {
      await this.resourceHelpDAO.delete(this.resourceHelpId);
    } catch (err) {
      throw new DatabaseError();
    }
  }
}
export default ResourceHelp;
