import Shelter from '../models/Shelter.js';
import InternalServerError from '../exceptions/InternalServerError.js';
import { uuid } from 'uuidv4';
import State from '../bin/State.js';

class ShelterController {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  async fetchAllShelters(page, pageSize, ascending, sheltername) {
    return new Promise(async (resolve, reject) => {
      try {
        let condition = {};
        if (sheltername) {
          condition = { name: sheltername };
        }
        let shelters = await Shelter.fetchAllShelters(
          this.dbClient,
          page,
          pageSize,
          ascending,
          condition,
        );

        resolve(shelters);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async createShelter(name, address, capacity, longitude, latitude) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(name, address, capacity, longitude, latitude, uuid());
        let shelter = new Shelter(
          this.dbClient,
          uuid(),
          name,
          address,
          capacity,
          longitude,
          latitude,
        );
        await shelter.createShelter();
        await State.getInstance().websocketSubsystem.sendSheterUpdateAlert(
          shelter,
        );
        resolve(shelter);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async deleteShelter(name) {
    return new Promise(async (resolve, reject) => {
      try {
        let shelter = new Shelter(
          this.dbClient,
          null,
          name,
          null,
          null,
          null,
          null,
        );
        await shelter.deleteShelter();
        await State.getInstance().websocketSubsystem.sendSheterUpdateAlert(
          shelter,
        );
        resolve();
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async updateShelter(name, address, capacity, longitude, latitude) {
    return new Promise(async (resolve, reject) => {
      try {
        let shelter = new Shelter(
          this.dbClient,
          uuid(),
          name,
          address,
          capacity,
          longitude,
          latitude,
        );
        await State.getInstance().websocketSubsystem.sendSheterUpdateAlert(
          shelter,
        );
        await shelter.updateShelter();
        resolve();
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }
}

export default ShelterController;
