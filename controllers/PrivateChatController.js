import PrivateMessage from '../models/PrivateMessage.js';
import { uuid } from 'uuidv4';
import InternalServerError from '../exceptions/InternalServerError.js';
import CurrentUserState from '../models/CurrentUserState.js';
import OnlineStatus from '../models/OnlineStatus.js';
import State from '../bin/State.js';
import SafetyStatus from '../models/SafetyStatus.js';
import PrivateMessageStatusEnum from '../models/PrivateMessageReadStatusEnum.js';
import AuthenticatedUser from '../models/AuthenticatedUser.js';

class PrivateChatController {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  async addPrivateMessage(senderId, message, receiverId) {
    return new Promise(async (resolve, reject) => {
      try {
        // Get safetyStatus from respective table
        let privateMessage = new PrivateMessage(
          this.dbClient,
          uuid(),
          senderId,
          message,
          await SafetyStatus.fetchMostRecentSafetyStatus(
            this.dbClient,
            senderId,
          ),
          Date.now(),
          receiverId,
          PrivateMessageStatusEnum.UNREAD,
        );
        privateMessage.sender = (
          await AuthenticatedUser.getUserById(this.dbClient, senderId)
        ).username;
        privateMessage.receiver = (
          await AuthenticatedUser.getUserById(this.dbClient, receiverId)
        ).username;
        // let userCurrentStatusList =
        //   await CurrentUserState.getAllCurrentUsersStates(
        //     this.dbClient,
        //     1,
        //     500,
        //   );
        // let receiverOnlineStatus = userCurrentStatusList.find(
        //   (user) => user._id === receiverId,
        // ).onlineStatus;
        console.log(privateMessage);
        await State.getInstance().websocketSubsystem.sendPrivateMessage(
          privateMessage,
        );
        await privateMessage.insertThisMessage();
        resolve(privateMessage);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async fetchAllPrivateMessagesBetween2Users(
    page,
    pageSize,
    ascending,
    userId1,
    userId2,
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          $or: [
            { senderId: userId1, receiverId: userId2 },
            { senderId: userId2, receiverId: userId1 },
          ],
        };
        console.log('condition', condition);
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
        let messages = await PrivateMessage.fetchAllMessages(
          privateMsg.messageDao,
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
        resolve(stringifiedData);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async fetchAllPrivateMessagesParticipants(page, pageSize, ascending, userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const condition = {
          $or: [{ senderId: userId }, { receiverId: userId }],
        };
        console.log('condition', condition);
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
        let messages = await PrivateMessage.fetchAllMessages(
          privateMsg.messageDao,
          page,
          pageSize,
          ascending,
          condition,
        );
        console.log('HOOOOOO', messages);
        //console.log(messages);
        let unreadMessagesList = messages.filter(
          (message) => message.readStatus === PrivateMessageStatusEnum.UNREAD,
        );
        let readMessagesList = messages.filter(
          (message) => message.readStatus === PrivateMessageStatusEnum.READ,
        );
        console.log('setp1', unreadMessagesList, readMessagesList);
        let unreadReceiverList = Array.from(
          new Set(unreadMessagesList.map((message) => message.receiverId)),
        );
        let readReceiverList = Array.from(
          new Set(readMessagesList.map((message) => message.receiverId)),
        );
        console.log('setp2', unreadReceiverList, readReceiverList);
        let unreadSenderList = Array.from(
          new Set(unreadMessagesList.map((message) => message.senderId)),
        );
        let readSenderList = Array.from(
          new Set(readMessagesList.map((message) => message.senderId)),
        );
        console.log('setp3', readSenderList, unreadSenderList);
        let unreadUserIdList = Array.from(
          new Set([...unreadReceiverList, ...unreadSenderList]),
        );
        let readUserIdList = Array.from(
          new Set([...readReceiverList, ...readSenderList]),
        );
        unreadUserIdList.forEach((element) => {
          if (readUserIdList.includes(element)) {
            readUserIdList = readUserIdList.filter((name) => name !== element);
          }
        });
        console.log(unreadUserIdList, readUserIdList);
        readUserIdList = readUserIdList.filter((entry) => entry !== userId);
        unreadUserIdList = unreadUserIdList.filter((entry) => entry !== userId);
        console.log('post filter', unreadUserIdList, readUserIdList);
        let fullUserList = await CurrentUserState.getAllCurrentUsersStates(
          this.dbClient,
          page,
          pageSize,
          true,
        );
        const readFilterFullUserList = fullUserList.filter((user) =>
          // console.log(user.userId.toString())
          readUserIdList.includes(user.userId.toString()),
        );
        const unreadFilterFullUserList = fullUserList.filter((user) =>
          unreadUserIdList.includes(user.userId.toString()),
        );

        console.log(readFilterFullUserList);
        console.log(unreadFilterFullUserList);
        resolve({
          read: readFilterFullUserList,
          unread: unreadFilterFullUserList,
        });
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async fetchAllPrivateMessagesSinceLastOnline(
    page,
    pageSize,
    ascending,
    userId,
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const userOnlineStatus = await OnlineStatus.fetchOnlineStatusOf(
          this.dbClient,
          userId,
        );
        const userLastOnline = Date.parse(userOnlineStatus.lastOnline);
        const condition = {
          $or: [{ receiverId: userId, timestamp: { $gt: userLastOnline } }],
        };
        let messages = await PrivateMessage.fetchAllPrivateMessages(
          this.dbClient,
          page,
          pageSize,
          ascending,
          condition,
        );
        let userIdList = Array.from(
          new Set(messages.map((message) => message.senderId)),
        );
        let fullUserList = await CurrentUserState.getAllCurrentUsersStates(
          this.dbClient,
          page,
          pageSize,
          true,
        );
        const filterFullUserList = fullUserList.filter((user) =>
          userIdList.includes(user._id),
        );
        resolve(filterFullUserList);
      } catch (error) {
        console.error(error);
        reject(new InternalServerError());
      }
    });
  }

  async updateReadStatus(senderId, receiverId) {
    try {
      console.log('in Contoller read');
      const readStatus = PrivateMessageStatusEnum.READ;

      let updateResult = await PrivateMessage.updateReadStatus(
        this.dbClient,
        senderId,
        receiverId,
        readStatus,
      );
      await State.getInstance().websocketSubsystem.sendReadMessage(
        senderId,
        receiverId,
      );
      console.log(updateResult);
      return updateResult;
    } catch (error) {
      throw error;
    }
  }
}

export default PrivateChatController;
