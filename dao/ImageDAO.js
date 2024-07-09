import DAO from './DAO.js';
import SchemaEnum from '../clients/SchemaEnum.js';

class ImageDAO extends DAO {
  constructor(dbClient) {
    super(dbClient);
  }

  // read all for an album
  async readAllWithPagination(condition, sort, pageSize, page) {
    return await this.dbClient.readAllWithPagination(
      SchemaEnum.IMAGE,
      condition,
      sort,
      pageSize,
      page,
    );
  }

  // read for a singular image
  async read(filter) {
    return await this.dbClient.read(SchemaEnum.IMAGE, filter);
  }

  // create a single entry
  async create(image) {
    return this.dbClient.create(SchemaEnum.IMAGE, image);
  }

  async delete(imageId) {
    return this.dbClient.delete(SchemaEnum.IMAGE, 'imageId', imageId);
  }

  async deleteMany(albumName) {
    return this.dbClient.deleteMany(SchemaEnum.IMAGE, 'album', albumName);
  }
}

export default ImageDAO;
