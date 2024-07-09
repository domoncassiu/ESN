import DAO from './DAO.js';
import SchemaEnum from '../clients/SchemaEnum.js';

class AnnouncementDAO extends DAO {
  constructor(dbClient) {
    super(dbClient);
  }

  async readAllWithPagination(condition, sort, pageSize, page) {
    return await this.dbClient.readAllWithPagination(
      SchemaEnum.ANNOUNCEMENT,
      condition,
      sort,
      pageSize,
      page,
    );
  }

  async create(announcement) {
    return this.dbClient.create(SchemaEnum.ANNOUNCEMENT, announcement);
  }
}

export default AnnouncementDAO;
