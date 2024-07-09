import AnnouncementDAO from '../dao/AnnouncementDAO.js';
import DatabaseError from '../exceptions/DatabaseError.js';

class Announcement {
  announcementDAO = null;
  constructor(dbClient, announcementId, userId, message, timestamp) {
    this.dbClient = dbClient;
    this.announcementId = announcementId;
    this.userId = userId;
    this.message = message;
    this.timestamp = timestamp;
    this.announcementDAO = new AnnouncementDAO(dbClient);
  }

  static async fetchAllAnnouncements(
    dbClient,
    page = 1,
    pageSize = 50,
    ascending = true,
    condition = {},
  ) {
    const order = ascending ? 1 : -1;
    try {
      return await new AnnouncementDAO(dbClient).readAllWithPagination(
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

  async insertThisAnnoucement() {
    try {
      await this.announcementDAO.create(this);
    } catch (err) {
      console.log(err);
      throw new DatabaseError();
    }
  }
}

export default Announcement;
