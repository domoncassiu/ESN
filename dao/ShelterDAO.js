import DAO from './DAO.js';
import SchemaEnum from '../clients/SchemaEnum.js';

class ShelterDAO extends DAO {
  constructor(dbClient) {
    super(dbClient);
  }

  async create(shelter) {
    return this.dbClient.create(SchemaEnum.SHELTER, shelter);
  }

  async readAllWithPagination(condition, sort, pageSize, page) {
    return await this.dbClient.readAllWithPagination(
      SchemaEnum.SHELTER,
      condition,
      sort,
      pageSize,
      page,
    );
  }

  async delete(name) {
    return await this.dbClient.delete(SchemaEnum.SHELTER, 'name', name);
  }

  async update(shelter) {
    try {
      return await this.dbClient.update(
        SchemaEnum.SHELTER,
        { name: shelter.name },
        {
          address: shelter.address,
          capacity: shelter.capacity,
          longitude: shelter.longitude,
          latitude: shelter.latitude,
        },
        {},
      );
    } catch (err) {
      console.log(err);
    }
  }
}

export default ShelterDAO;
