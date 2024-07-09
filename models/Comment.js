import CommentDAO from '../dao/CommentDAO.js';
import DatabaseError from '../exceptions/DatabaseError.js';

class Comment {
  commentDAO = null;
  constructor(
    dbClient,
    commentId,
    posterId,
    imageId,
    safetyStatus,
    comment,
    albumName,
    timestamp,
  ) {
    this.dbClient = dbClient;
    this.commentId = commentId;
    this.posterId = posterId;
    this.imageId = imageId;
    this.safetyStatus = safetyStatus;
    this.comment = comment;
    this.albumName = albumName;
    this.timestamp = timestamp;
    this.commentDAO = new CommentDAO(dbClient);
  }

  static async fetchAllCommentsForImage(
    dbClient,
    page = 1,
    pageSize = 50,
    ascending = true,
    condition = {},
  ) {
    const order = ascending ? 1 : -1;
    try {
      return await new CommentDAO(dbClient).readAllWithPagination(
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

  async insertThisComment() {
    try {
      await this.commentDAO.create(this);
    } catch (err) {
      throw new DatabaseError();
    }
  }

  static async deleteAllCommentsFor(dbClient, imageId) {
    try {
      await new CommentDAO(dbClient).deleteMany(imageId);
    } catch (err) {
      throw new DatabaseError();
    }
  }
}

export default Comment;
