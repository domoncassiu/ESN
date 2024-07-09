import DatabaseError from '../exceptions/DatabaseError.js';
import PrivateMessageDAO from '../dao/PrivateMessageDAO.js';
import Message from './Message.js';

class PrivateMessage extends Message {
  constructor(
    dbClient,
    messageId,
    senderId,
    message,
    safetyStatus,
    timestamp,
    receiverId,
    readStatus,
  ) {
    super(
      new PrivateMessageDAO(dbClient),
      messageId,
      senderId,
      message,
      safetyStatus,
      timestamp,
    );
    this.receiverId = receiverId;
    this.readStatus = readStatus;
  }

  isValid() {
    return (
      super.isValid() &&
      this.receiverId !== null &&
      this.receiverId !== undefined
    );
  }

  static async fetchAllPrivateMessages(
    dbClient,
    page,
    pageSize,
    ascending,
    condition,
  ) {
    return Message.fetchAllMessages(
      new PrivateMessageDAO(dbClient),
      page,
      pageSize,
      ascending,
      condition,
    );
  }

  static async updateReadStatus(dbClient, you, other, readStatus) {
    try {
      let filter = { senderId: other, receiverId: you };
      let update = {
        $set: { readStatus: readStatus },
      };
      let options = {
        upsert: false,
        setDefaultsOnInsert: false,
        includeResultMetadata: true,
      };
      const result = await Message.updateMessage(
        new PrivateMessageDAO(dbClient),
        filter,
        update,
        options,
      );
      return (
        result.lastErrorObject !== undefined &&
        result.lastErrorObject.updatedExisting
      );
    } catch (err) {
      console.error(err);
      throw new DatabaseError();
    }
  }
}

export default PrivateMessage;
