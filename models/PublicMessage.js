import PublicMessageDAO from '../dao/PublicMessageDAO.js';
import Message from './Message.js';

class PublicMessage extends Message {
  constructor(dbClient, messageId, senderId, message, safetyStatus, timestamp) {
    super(
      new PublicMessageDAO(dbClient),
      messageId,
      senderId,
      message,
      safetyStatus,
      timestamp,
    );
  }

  isValid() {
    return super.isValid();
  }

  static async fetchAllPublicMessages(
    dbClient,
    page,
    pageSize,
    ascending,
    condition,
  ) {
    return Message.fetchAllMessages(
      new PublicMessageDAO(dbClient),
      page,
      pageSize,
      ascending,
      condition,
    );
  }
}

export default PublicMessage;
