import ResourceHelp from '../models/ResourceHelp.js';
import InternalServerError from '../exceptions/InternalServerError.js';
import { uuid } from 'uuidv4';
import { log } from 'debug';

class ResourceHelpController {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  async addNewResourceHelp(resource, helper, quantityOffered, address) {
    log(resource, helper, quantityOffered, address);
    return new Promise(async (resolve, reject) => {
      try {
        let resourceHelp = new ResourceHelp(
          this.dbClient,
          uuid(),
          resource,
          helper,
          quantityOffered,
          address,
          Date.now(),
        );
        await resourceHelp.insertThisResourceHelp();
        resolve(resourceHelp);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }
}

export default ResourceHelpController;
