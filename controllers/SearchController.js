import CurrentUserState from '../models/CurrentUserState.js';
import InternalServerError from '../exceptions/InternalServerError.js';
import Announcement from '../models/Announcement.js';
import Utils from '../utils/Utils.js';
import PublicMessage from '../models/PublicMessage.js';
import SafetyStatus from '../models/SafetyStatus.js';
import PrivateMessage from '../models/PrivateMessage.js';
import AuthenticatedUser from '../models/AuthenticatedUser.js';
import Incident from '../models/Incident.js';

class SearchController {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  async searchCitizens(page, keyword) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = { username: { $regex: keyword, $options: 'i' } };
        const pageSize = 500;
        const ascending = true;
        let messages = await CurrentUserState.getAllCurrentUsersStates(
          this.dbClient,
          page,
          pageSize,
          ascending,
          condition,
        );

        resolve(messages);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async searchStatuses(keyword) {
    return new Promise(async (resolve, reject) => {
      try {
        let messages = await CurrentUserState.getUsersByStatus(
          this.dbClient,
          keyword,
        );
        resolve(messages);
      } catch (err) {
        console.error('errrrrrrr', err);
        reject(new InternalServerError());
      }
    });
  }

  async searchPublicAnnouncements(page, keyword) {
    return new Promise(async (resolve, reject) => {
      keyword = Utils.filterStopWords(keyword);
      try {
        const condition = {
          $text: {
            $search: keyword,
          },
        };
        const pageSize = 10;
        const ascending = false;
        let messages = await Announcement.fetchAllAnnouncements(
          this.dbClient,
          page,
          pageSize,
          ascending,
          condition,
        );

        resolve(messages);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async searchIncidents(page, keyword) {
    return new Promise(async (resolve, reject) => {
      keyword = Utils.filterStopWords(keyword);
      try {
        const condition = {
          $text: {
            $search: keyword,
          },
        };
        const pageSize = 10;
        const ascending = false;
        let messages = await Incident.fetchAllIncidents(
          this.dbClient,
          page,
          pageSize,
          ascending,
          condition,
        );

        resolve(messages);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async searchPublicMessage(page, keyword) {
    return new Promise(async (resolve, reject) => {
      keyword = Utils.filterStopWords(keyword);
      try {
        const condition = {
          $text: {
            $search: keyword,
          },
        };
        const pageSize = 10;
        const ascending = false;
        let pubmsg = new PublicMessage(this.dbClient, '', '', '', '', '', '');
        let messages = await PublicMessage.fetchAllMessages(
          pubmsg.messageDao,
          page,
          pageSize,
          ascending,
          condition,
        );
        let parsedData = JSON.parse(JSON.stringify(messages));
        for (let entry of parsedData) {
          // Assuming you have a function getUsernameById to retrieve the username from the senderId
          const user = await AuthenticatedUser.getUserById(
            this.dbClient,
            entry.senderId,
          );
          entry.username = user.username;
        }
        const stringifiedData = JSON.parse(JSON.stringify(parsedData));
        let fullUserList = Array.from(
          await CurrentUserState.getAllCurrentUsersStates(
            this.dbClient,
            1,
            500,
          ),
        );
        let filteredUserList = fullUserList.map((user) =>
          user.userId.toString(),
        );
        let arrayData = Array.from(stringifiedData);
        let filteredArrayData = arrayData.filter((data) =>
          filteredUserList.includes(data.senderId),
        );
        resolve(JSON.parse(JSON.stringify(filteredArrayData)));
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async searchUsersStatuses(page, receiverId) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!receiverId) {
          resolve([]);
        }

        const condition = {
          userId: receiverId,
        };
        const pageSize = 10;
        const ascending = false;
        let messages = await SafetyStatus.fetchAllStatuses(
          this.dbClient,
          page,
          pageSize,
          ascending,
          condition,
        );

        resolve(messages);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async searchPrivateMessage(page, keyword, senderId, receiverId) {
    keyword = Utils.filterStopWords(keyword);
    let privateMsg = new PrivateMessage(
      this.dbClient,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    );
    return new Promise(async (resolve, reject) => {
      try {
        console.log('senderid', senderId);
        console.log('receiver', receiverId);
        const condition = {
          $and: [
            {
              $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId },
              ],
            },
            {
              $text: {
                $search: keyword,
              },
            },
          ],
        };
        const pageSize = 10;
        const ascending = false;
        let messages = await PrivateMessage.fetchAllMessages(
          privateMsg.messageDao,
          page,
          pageSize,
          ascending,
          condition,
        );
        const parsedMessages = JSON.parse(JSON.stringify(messages));
        for (let message of parsedMessages) {
          const senderUser = await AuthenticatedUser.getUserById(
            this.dbClient,
            message.senderId,
          );
          const senderName = senderUser.username;
          message.sender = senderName;
          console.log('loghere', message);
        }
        resolve(JSON.parse(JSON.stringify(parsedMessages)));
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }
}

export default SearchController;
