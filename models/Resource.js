import ResourceDAO from '../dao/ResourceDAO.js';
import DatabaseError from '../exceptions/DatabaseError.js';

class Resource {
  resourceDAO = null;

  constructor(
    dbClient,
    resourceId,
    name,
    quantity,
    location,
    additionalInfo,
    user,
  ) {
    this.dbClient = dbClient;
    this.resourceId = resourceId;
    this.name = name;
    this.quantity = quantity;
    this.location = location;
    this.additionalInfo = additionalInfo;
    this.user = user;
    this.resourceDAO = new ResourceDAO(dbClient);
  }

  async insertThisResource() {
    const resourceData = {
      name: this.name,
      quantity: this.quantity,
      location: this.location,
      additionalInfo: this.additionalInfo,
      user: this.user,
    };
    try {
      await this.resourceDAO.create(resourceData);
      // await this.resourceDAO.create(this);
    } catch (err) {
      throw new DatabaseError();
    }
  }

  static async deleteThisResource(dbClient, resource, resourceId) {
    try {
      await new ResourceDAO(dbClient).delete(resource, resourceId);
    } catch (err) {
      throw new DatabaseError();
    }
  }
  static async fetchResourceById(dbClient, resourceId) {
    try {
      return await new ResourceDAO(dbClient).readById(resourceId);
    } catch (err) {
      console.error(err);
      throw new DatabaseError();
    }
  }

  static async fetchAllResources(
    dbClient,
    page = 1,
    pageSize = 50,
    ascending = true,
    condition = {},
  ) {
    const order = ascending ? 1 : -1;
    try {
      return await new ResourceDAO(dbClient).readAllWithPagination(
        condition,
        { createdAt: order },
        pageSize,
        page,
      );
    } catch (err) {
      console.error(err);
      throw new DatabaseError();
    }
  }
}

export default Resource;
