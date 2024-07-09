import ShelterDAO from '../dao/ShelterDAO.js';
import DatabaseError from '../exceptions/DatabaseError.js';

class Shelter {
  shelterDAo = null;
  constructor(
    dbClient,
    shelterID,
    name,
    address,
    capacity,
    longitude,
    latitude,
  ) {
    this.dbClient = dbClient;
    this.shelterID = shelterID;
    this.name = name;
    this.address = address;
    this.capacity = capacity;
    this.longitude = longitude;
    this.latitude = latitude;
    this.shelterDAO = new ShelterDAO(dbClient);
  }

  static async fetchAllShelters(
    dbClient,
    page = 1,
    pageSize = 50,
    ascending = true,
    condition = {},
  ) {
    const order = ascending ? 1 : -1;
    try {
      return await new ShelterDAO(dbClient).readAllWithPagination(
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

  async createShelter() {
    try {
      console.log(this.shelterID);
      await this.shelterDAO.create(this);
    } catch (err) {
      throw new DatabaseError();
    }
  }

  async deleteShelter() {
    try {
      const deletedItem = await this.shelterDAO.delete(this.name);
      if (!deletedItem) {
        throw new DatabaseError();
      }
    } catch (err) {
      throw new DatabaseError();
    }
  }

  async updateShelter() {
    try {
      await this.shelterDAO.update(this);
    } catch (err) {
      throw new DatabaseError();
    }
  }
}

export default Shelter;
