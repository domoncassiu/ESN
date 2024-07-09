import Resource from '../models/Resource.js';
import InternalServerError from '../exceptions/InternalServerError.js';
import { uuid } from 'uuidv4';
import State from '../bin/State.js';

class ResourceController {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  async fetchAllResources(page, pageSize, ascending, userId = null) {
    return new Promise(async (resolve, reject) => {
      try {
        let condition = userId ? { user: userId } : {};
        let resources;
        if (userId) {
          resources = await Resource.fetchAllResources(
            this.dbClient,
            page,
            pageSize,
            ascending,
            condition,
          );
        } else {
          resources = await Resource.fetchAllResources(
            this.dbClient,
            page,
            pageSize,
            ascending,
          );
        }

        resolve(resources);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async deleteResourceById(resource, resourceId) {
    return new Promise(async (resolve, reject) => {
      try {
        await Resource.deleteThisResource(this.dbClient, resource, resourceId);
        resolve({ message: 'Resource successfully deleted.' });
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async fetchResourceById(resourceId) {
    return new Promise(async (resolve, reject) => {
      try {
        const resource = await Resource.fetchResourceById(
          this.dbClient,
          resourceId,
        );
        resolve(resource);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }
  async addNewResource(name, quantity, location, additionalInfo, user) {
    return new Promise(async (resolve, reject) => {
      try {
        let resource = new Resource(
          this.dbClient,
          uuid(),
          name,
          quantity,
          location,
          additionalInfo,
          user,
          Date.now(),
        );
        await resource.insertThisResource();
        await State.getInstance().websocketSubsystem.sendResourceRequest();
        resolve(resource);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }
}

export default ResourceController;
