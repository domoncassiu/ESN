import DatabaseError from '../exceptions/DatabaseError.js';
import SafetyStatusEnum from './SafetyStatusEnum.js';
import SafetyStatusDAO from '../dao/SafetyStatesDAO.js';

class SafetyStatus {
  safetyStatusDAO = null;

  constructor(dbClient, userId, safetyStatus, timestamp) {
    this.userId = userId;
    this.safetyStatus = safetyStatus;
    this.timestamp = timestamp;
    this.safetyStatusDAO = new SafetyStatusDAO(dbClient);
  }

  isValid() {
    return (
      this.userId !== null &&
      this.userId !== undefined &&
      this.safetyStatus !== null &&
      this.safetyStatus !== undefined &&
      this.timestamp !== null &&
      this.timestamp !== undefined
    );
  }

  async setUserSafetyStatus() {
    try {
      let isCreated = false;
      // let filter = { username: this.username };
      // let update = {
      //   safetyStatus: this.safetyStatus,
      //   timestamp: this.timestamp,
      // };
      // let options = {
      //   upsert: true,
      //   setDefaultsOnInsert: true,
      // };
      const status = {
        userId: this.userId,
        safetyStatus: this.safetyStatus,
        timestamp: this.timestamp,
      };
      console.log('new status received', status);
      const result = await this.safetyStatusDAO.create(status);
      isCreated = true;
      return isCreated;
    } catch (err) {
      console.error(err);
      throw new DatabaseError();
    }
  }

  static async fetchMostRecentSafetyStatus(dbClient, userId) {
    try {
      const filter = { userId: userId };
      const options = { sort: { timestamp: -1 } };
      let result = await new SafetyStatusDAO(dbClient).read(filter, options);
      // console.log('safetyResult', result);
      if (!result) {
        let newSafetyStatus = new SafetyStatus(
          dbClient,
          userId,
          SafetyStatusEnum.UNDEFINED,
          Date.now(),
        );
        await newSafetyStatus.setUserSafetyStatus();
        return newSafetyStatus.safetyStatus;
      }
      return result.safetyStatus;
    } catch (err) {
      console.error(err);
      throw new DatabaseError();
    }
  }

  static async fetchAllStatuses(
    dbClient,
    page = 1,
    pageSize = 10,
    ascending = true,
    condition,
  ) {
    try {
      const order = ascending ? 1 : -1;
      return await new SafetyStatusDAO(dbClient).readAllWithPagination(
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

  static async fetchSafetyStatusMapOf(dbClient, userIdArray) {
    const condition = {
      userId: { $in: userIdArray },
    };
    const records = await new SafetyStatusDAO(dbClient).readAll(condition);
    let usernameStatusMap = {};
    userIdArray.forEach((userId) => {
      usernameStatusMap[userId] = SafetyStatusEnum.UNDEFINED;
    });
    records.forEach((record) => {
      if (Object.values(SafetyStatusEnum).includes(record.safetyStatus)) {
        usernameStatusMap[record.userId] = record.safetyStatus;
      }
    });
    return usernameStatusMap;
  }
}

export default SafetyStatus;
