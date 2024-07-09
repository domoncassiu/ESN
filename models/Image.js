import ImageDAO from '../dao/ImageDAO.js';
import DatabaseError from '../exceptions/DatabaseError.js';

class Image {
  imageDAO = null;
  constructor(dbClient, imageId, posterId, imageUrl, album, timestamp) {
    this.dbClient = dbClient;
    this.imageId = imageId;
    this.posterId = posterId;
    this.imageUrl = imageUrl;
    this.album = album;
    this.timestamp = timestamp;
    this.imageDAO = new ImageDAO(dbClient);
  }

  static async fetchAllImagesInAlbum(
    dbClient,
    page = 1,
    pageSize = 50,
    ascending = true,
    condition = {},
  ) {
    const order = ascending ? 1 : -1;
    try {
      return await new ImageDAO(dbClient).readAllWithPagination(
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

  static async fetchOneImage(dbClient, albumName, imageId) {
    try {
      return await new ImageDAO(dbClient).read({
        imageId: imageId,
        album: albumName,
      });
    } catch (err) {
      console.log(err);
      throw new DatabaseError();
    }
  }

  async insertThisImage() {
    try {
      console.log(this);
      await this.imageDAO.create(this);
    } catch (err) {
      console.log(err);
      throw new DatabaseError();
    }
  }

  async deleteThisImage() {
    try {
      console.log(this.imageId);
      await this.imageDAO.delete(this.imageId);
    } catch (error) {
      console.log(error);
      throw new DatabaseError();
    }
  }
  static async deleteAlbum(dbClient, albumName) {
    try {
      await new ImageDAO(dbClient).deleteMany(albumName);
    } catch (error) {
      console.log(error);
      throw new DatabaseError();
    }
  }
}

export default Image;
