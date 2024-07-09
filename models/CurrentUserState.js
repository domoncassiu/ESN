import AuthenticatedUser from './AuthenticatedUser.js';
import UserType from './UserType.js';
import SafetyStatusEnum from './SafetyStatusEnum.js';
import OnlineStatusEnum from './OnlineStatusEnum.js';
import DatabaseError from '../exceptions/DatabaseError.js';
import OnlineStatus from './OnlineStatus.js';
import SafetyStatus from './SafetyStatus.js';
import UserDAO from '../dao/UserDAO.js';
import SafetyStatusDAO from '../dao/SafetyStatesDAO.js';

class CurrentUserState extends AuthenticatedUser {
  userDAO = null;
  safetyStatusDAO = null;

  constructor(
    dbClient,
    username,
    password,
    type = UserType.CITIZEN,
    acknowledged = false,
    isActive = true,
    safetyStatus = SafetyStatusEnum.UNDEFINED,
    onlineStatus = OnlineStatusEnum.OFFLINE,
  ) {
    super(username, password, type, acknowledged, isActive);
    this.safetyStatus = safetyStatus;
    this.onlineStatus = onlineStatus;
    this.userDAO = new UserDAO(dbClient);
    this.safetyStatusDAO = new SafetyStatusDAO(dbClient);
  }

  static async getAllCurrentUsersStates(
    dbClient,
    page = 1,
    pageSize = 50,
    ascending = true,
    condition = {},
  ) {
    const order = ascending ? 1 : -1;
    try {
      const results = await new UserDAO(dbClient).readAllWithPagination(
        condition,
        { username: order },
        pageSize,
        page,
      );
      let userIdArray = results.map((result) => result._id);
      let userIdToOnlineStatusMap = await OnlineStatus.fetchOnlineStatusMapOf(
        dbClient,
        userIdArray,
      );
      let userIdToSafetyStatusMap = await SafetyStatus.fetchSafetyStatusMapOf(
        dbClient,
        userIdArray,
      );
      return results.map((result) => {
        return {
          userId: result._id,
          username: result.username,
          type: result.type,
          acknowledged: result.acknowledged,
          isActive: result.isActive,
          onlineStatus: userIdToOnlineStatusMap[result._id],
          safetyStatus: userIdToSafetyStatusMap[result._id],
        };
      });
    } catch (err) {
      console.error(err);
      throw new DatabaseError();
    }
  }

  static async getUsersByStatus(dbClient, keyword) {
    try {
      // aggregation for getting the latest entry for a user with a certain status
      const aggregation = [
        { $match: { safetyStatus: keyword } },
        { $sort: { timestamp: -1 } },
        {
          $group: {
            _id: '$userId',
            safetyStatus: { $first: '$safetyStatus' },
            timestamp: { $first: '$timestamp' },
            updatedAt: { $first: '$updatedAt' },
          },
        },
        { $sort: { _id: 1 } },
      ];
      const safetyStatuses = await new SafetyStatusDAO(
        dbClient,
      ).readAllWithAggregate(aggregation);
      let mappedSafetyStatuses = await Promise.all(
        safetyStatuses.map(async (result) => {
          let safetyStatus = new SafetyStatus(
            dbClient,
            result._id,
            result.safetyStatus,
            result.timestamp,
          );
          delete safetyStatus.safetyStatusDAO;
          delete safetyStatus.dbClient;
          let user = await AuthenticatedUser.getUserById(
            dbClient,
            safetyStatus.userId,
          );
          console.log(user.username);
          safetyStatus.username = user.username;
          return safetyStatus;
        }),
      );
      // get online status map
      let userIdArray = mappedSafetyStatuses.map(
        (safetyStatus) => safetyStatus.userId,
      );
      let userIdToOnlineStatusMap = await OnlineStatus.fetchOnlineStatusMapOf(
        dbClient,
        userIdArray,
      );

      // combine username, safety status, and online status
      const usersWithStatuses = mappedSafetyStatuses.map((user) => ({
        userId: user._id,
        username: user.username,
        onlineStatus: userIdToOnlineStatusMap[user._id],
        safetyStatus: user.safetyStatus,
        timestamp: user.timestamp,
      }));
      return usersWithStatuses;
    } catch (err) {
      console.error('err2', err);
      throw new DatabaseError();
    }
  }
}

export default CurrentUserState;
