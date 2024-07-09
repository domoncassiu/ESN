import DatabaseError from '../exceptions/DatabaseError.js';
import OnlineStatusEnum from './OnlineStatusEnum.js';
import OnlineStatusDAO from '../dao/OnlineStatusDAO.js';

class OnlineStatus {
  onlineStatusDAO = null;
  constructor(dbClient, userId, onlineStatus, lastOnline, timestamp) {
    this.userId = userId;
    this.onlineStatus = onlineStatus;
    this.lastOnline = lastOnline;
    this.timestamp = timestamp;
    this.onlineStatusDAO = new OnlineStatusDAO(dbClient);
  }

  isValid() {
    return (
      this.userId !== null &&
      this.userId !== undefined &&
      this.onlineStatus !== null &&
      this.onlineStatus !== undefined &&
      this.timestamp !== null &&
      this.timestamp !== undefined &&
      this.lastOnline !== null &&
      this.lastOnline !== undefined
    );
  }

  async setUserOnlineStatus(isLogout) {
    try {
      let isUpdated = false;
      let filter = { userId: this.userId };
      let update;
      if (isLogout) {
        update = {
          onlineStatus: this.onlineStatus,
          timestamp: this.timestamp,
          lastOnline: this.lastOnline,
        };
      } else {
        update = {
          onlineStatus: this.onlineStatus,
          timestamp: this.timestamp,
        };
      }
      let options = {
        upsert: true,
        setDefaultsOnInsert: true,
      };
      const result = await this.onlineStatusDAO.update(filter, update, options);
      isUpdated = true;
      return isUpdated;
    } catch (err) {
      console.error(err);
      throw new DatabaseError();
    }
  }

  static async fetchOnlineStatusMapOf(dbClient, userIdArray) {
    const condition = {
      userId: { $in: userIdArray },
    };
    const records = await new OnlineStatusDAO(dbClient).readAll(condition);
    let usernameStatusMap = {};
    userIdArray.forEach((userId) => {
      usernameStatusMap[userId] = OnlineStatusEnum.OFFLINE;
    });
    records.forEach((record) => {
      if (Object.values(OnlineStatusEnum).includes(record.onlineStatus)) {
        usernameStatusMap[record.userId] = record.onlineStatus;
      }
    });
    return usernameStatusMap;
  }

  static async fetchOnlineStatusOf(dbClient, userId) {
    try {
      const onlineStatus = await new OnlineStatusDAO(dbClient).read({
        userId: userId,
      });
      return onlineStatus;
    } catch (error) {
      throw new DatabaseError();
    }
  }
}

export default OnlineStatus;
