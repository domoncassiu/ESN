import InvalidEntryError from '../exceptions/InvalidEntryError.js';
import Message from './Message.js';
import GroupMessageDAO from '../dao/GroupMessageDAO.js';

export default class GroupMessage extends Message {
  constructor(
    dbClient,
    messageId,
    senderId,
    message,
    safetyStatus,
    timestamp,
    incidentId,
    sentiment,
  ) {
    super(
      new GroupMessageDAO(dbClient),
      messageId,
      senderId,
      message,
      safetyStatus,
      timestamp,
    );
    this.incidentId = incidentId;
    this.sentiment = sentiment;
  }

  static async fetchAllGroupMessages(
    dbClient,
    page,
    pageSize,
    ascending,
    condition,
  ) {
    return await Message.fetchAllMessages(
      new GroupMessageDAO(dbClient),
      page,
      pageSize,
      ascending,
      condition,
    );
  }

  static async fetchOneGroupMessage(dbClient, incidentId, messageId) {
    return Message.fetchMessage(new GroupMessageDAO(dbClient), {
      incidentId: incidentId,
      messageId: messageId,
    });
  }

  static async updateMessageSentiment(dbClient, messageId, newSentiment) {
    try {
      const filter = { messageId: messageId };
      const update = { sentiment: newSentiment };
      const options = {
        upsert: false,
        includeResultMetadata: true,
        new: true,
      };
      let result = await Message.updateOneMessage(
        new GroupMessageDAO(dbClient),
        filter,
        update,
        options,
      );
      console.log(result);
      return result;
    } catch (err) {
      console.error(err);
      throw new InvalidEntryError();
    }
  }
}
