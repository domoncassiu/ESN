import PublicMessage from '../models/PublicMessage.js';
import InternalServerError from '../exceptions/InternalServerError.js';
import { uuid } from 'uuidv4';
import SafetyStatus from '../models/SafetyStatus.js';
import State from '../bin/State.js';
import SafetyStatusEnum from '../models/SafetyStatusEnum.js';
import AuthenticatedUser from '../models/AuthenticatedUser.js';
import CurrentUserState from '../models/CurrentUserState.js';

class PublicChatController {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  async addPublicMessage(senderId, username, message) {
    return new Promise(async (resolve, reject) => {
      try {
        let publicMessage;
        if (State.getInstance().mode === 'TEST') {
          publicMessage = new PublicMessage(
            this.dbClient,
            uuid(),
            senderId,
            message,
            SafetyStatusEnum.OK,
            Date.now(),
          );
        } else {
          // fetech safety status here
          publicMessage = new PublicMessage(
            this.dbClient,
            uuid(),
            senderId,
            message,
            await SafetyStatus.fetchMostRecentSafetyStatus(
              this.dbClient,
              senderId,
            ),
            Date.now(),
          );
        }
        console.log(senderId);
        let responseObj = JSON.parse(JSON.stringify(publicMessage));
        responseObj.username = username;
        console.log(responseObj);
        await State.getInstance().websocketSubsystem.sendPublicMessage(
          responseObj,
        );
        await publicMessage.insertThisMessage();
        resolve(publicMessage);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async fetchAllPublicMessages(page, pageSize, ascending) {
    return new Promise(async (resolve, reject) => {
      try {
        let messages = await PublicMessage.fetchAllPublicMessages(
          this.dbClient,
          page,
          pageSize,
          ascending,
        );
        console.log(messages);
        let parsedData = JSON.parse(JSON.stringify(messages));
        let parsedMap = {};
        parsedData.map((entry) => (parsedMap[entry.senderId] = entry));
        let userIdArray = Object.keys(parsedMap);
        const condition = {
          _id: { $in: userIdArray },
        };
        const users = await AuthenticatedUser.findAllUsers(
          this.dbClient,
          condition,
        );
        console.log('crazy', parsedMap['testUserId']);
        console.log('crazy', users);
        users.map((user) => (parsedMap[user._id].username = user.username));
        if (State.getInstance().mode === 'TEST') {
          resolve(Object.values(parsedMap));
        } else {
          let fullUserList = Array.from(
            await CurrentUserState.getAllCurrentUsersStates(
              this.dbClient,
              1,
              500,
            ),
          );
          let filteredUserList = fullUserList
            .filter((user) => user.isActive === true)
            .map((user) => user.userId.toString());
          let arrayData = Array.from(Object.values(parsedMap));
          let filteredArrayData = arrayData.filter((data) =>
            filteredUserList.includes(data.senderId),
          );
          resolve(JSON.parse(JSON.stringify(filteredArrayData)));
        }
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }
}

export default PublicChatController;
