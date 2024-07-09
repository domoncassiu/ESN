import DatabaseError from '../exceptions/DatabaseError.js';
import SafetyStatusEnum from './SafetyStatusEnum.js';
import InvalidEntryError from '../exceptions/InvalidEntryError.js';

export default class Message {
  messageDao = null;
  constructor(
    messageDao,
    messageId,
    senderId,
    message,
    safetyStatus,
    timestamp,
  ) {
    this.messageId = messageId;
    this.senderId = senderId;
    this.message = message;
    this.safetyStatus = safetyStatus;
    this.timestamp = timestamp;
    this.messageDao = messageDao;
  }

  async insertThisMessage() {
    try {
      console.log(this);
      await this.messageDao.create(this);
    } catch (err) {
      throw new DatabaseError();
    }
  }

  isValid() {
    return (
      this.senderId !== null &&
      this.senderId !== undefined &&
      this.message !== null &&
      this.message !== undefined &&
      this.message !== '' &&
      this.safetyStatus !== null &&
      this.safetyStatus !== undefined &&
      SafetyStatusEnum[this.safetyStatus] !== undefined &&
      this.timestamp !== null &&
      this.timestamp !== undefined &&
      this.messageId !== null &&
      this.messageId !== undefined
    );
  }

  static async fetchAllMessages(
    messageDao,
    page = 1,
    pageSize = 50,
    ascending = false,
    condition,
  ) {
    const order = ascending ? 1 : -1;
    try {
      return await messageDao.readAllWithPagination(
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

  static async updateMessage(messageDao, filter, update, options) {
    try {
      const result = await messageDao.updateMany(filter, update, options);
      return result;
    } catch (err) {
      console.error(err);
      throw new DatabaseError();
    }
  }

  static async updateOneMessage(messageDao, filter, update, options) {
    try {
      const result = await messageDao.update(filter, update, options);
      return result;
    } catch (err) {
      console.error(err);
      throw new DatabaseError();
    }
  }

  static async fetchMessage(messageDao, condition) {
    try {
      return await messageDao.read(condition);
    } catch (err) {
      console.error(err);
      throw new InvalidEntryError();
    }
  }
}
