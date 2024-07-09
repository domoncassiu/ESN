import { expect, jest, test } from '@jest/globals';
import SafetyStatus from '../../../models/SafetyStatus';
import SafetyStatusEnum from '../../../models/SafetyStatusEnum';
import CurrentUserState from '../../../models/CurrentUserState';
import OnlineStatusEnum from '../../../models/OnlineStatusEnum';
import State from '../../../bin/State';
import ModeEnum from '../../../bin/ModeEnum';
import WebsocketSubsystem from '../../../subsystems/WebsocketSubsystem';
import PrivateMessage from '../../../models/PrivateMessage';
import PrivateChatController from '../../../controllers/PrivateChatController';
import TestDBClient from '../../../clients/TestDBClient';
import PrivateMessageStatusEnum from '../../../models/PrivateMessageReadStatusEnum';
import OnlineStatus from '../../../models/OnlineStatus';
import Message from '../../../models/Message';
import AuthenticatedUser from '../../../models/AuthenticatedUser';

let privateChatController = new PrivateChatController(
  TestDBClient.getInstance(),
);

// Mock functions
let fetchMostRecentSafetyStatus = jest
  .spyOn(SafetyStatus, 'fetchMostRecentSafetyStatus')
  .mockReturnValue(SafetyStatusEnum.OK);

let getAllCurrentUsersStates = jest
  .spyOn(CurrentUserState, 'getAllCurrentUsersStates')
  .mockImplementation(() => [
    {
      userId: 'testUserId1',
      username: 'mary',
      onlineStatus: OnlineStatusEnum.ONLINE,
      safetyStatus: SafetyStatusEnum.OK,
      timestamp: 1711581345192,
    },
    {
      userId: 'testUserId2',
      username: 'bob',
      onlineStatus: OnlineStatusEnum.ONLINE,
      safetyStatus: SafetyStatusEnum.OK,
      timestamp: 1711581345192,
    },
  ]);

let sendPrivateMessage = jest
  .spyOn(WebsocketSubsystem.prototype, 'sendPrivateMessage')
  .mockImplementation(() => {
    console.log('mocked function');
  });

let sendReadMessage = jest
  .spyOn(WebsocketSubsystem.prototype, 'sendReadMessage')
  .mockImplementation(() => {
    console.log('mocked function');
  });

let insertThisMessage = jest
  .spyOn(PrivateMessage.prototype, 'insertThisMessage')
  .mockReturnValue(undefined);

let fetchAllMessagesPrivate = jest
  .spyOn(PrivateMessage, 'fetchAllMessages')
  .mockImplementation(() => [
    {
      messageId: '12345',
      senderId: 'testUserId1',
      message: 'Hello, Bob!',
      safetyStatus: SafetyStatusEnum.OK,
      timestamp: 1711581345192,
      receiverId: 'testUserId2',
      readStatus: PrivateMessageStatusEnum.READ,
    },
  ]);

let fetchAllMessages = jest
  .spyOn(Message, 'fetchAllMessages')
  .mockImplementation(() => [
    {
      messageId: '12345',
      senderId: 'testUserId1',
      message: 'Hello, Bob!',
      safetyStatus: SafetyStatusEnum.OK,
      timestamp: 1711581345192,
      receiverId: 'testUserId2',
      readStatus: PrivateMessageStatusEnum.READ,
    },
  ]);

let getUserById = jest
  .spyOn(AuthenticatedUser, 'getUserById')
  .mockImplementation(() => [
    {
      username: 'mary',
    },
  ]);

let fetchOnlineStatusOf = jest
  .spyOn(OnlineStatus, 'fetchOnlineStatusOf')
  .mockImplementation(() => {
    return {
      userId: 'testUserId2',
      username: 'bob',
      onlineStatus: OnlineStatusEnum.ONLINE,
      timestamp: 1711581345192,
    };
  });

let updateReadStatus = jest
  .spyOn(PrivateMessage, 'updateReadStatus')
  .mockImplementation(() => 1);

State.getInstance().mode = ModeEnum.PRODUCTION;
State.getInstance().websocketSubsystem = new WebsocketSubsystem();

describe('Test controller: PrivateChatController', () => {
  test('Publish private message: addPrivateMessage', async () => {
    let privateMessage = await privateChatController.addPrivateMessage(
      'testUserId1',
      'Hello, Bob!',
      'testUserId2',
    );
    expect(fetchMostRecentSafetyStatus).toBeCalledTimes(1);
    expect(sendPrivateMessage).toBeCalledTimes(1);
    expect(insertThisMessage).toBeCalledTimes(1);
    expect(privateMessage.senderId).toStrictEqual('testUserId1');
    expect(privateMessage.receiverId).toStrictEqual('testUserId2');
    expect(privateMessage.message).toStrictEqual('Hello, Bob!');
  });
  test('Fetch Private Messages: fetchAllPrivateMessagesBetween2Users, fetchAllPrivateMessagesParticipants, fetchAllPrivateMessagesSinceLastOnline', async () => {
    let allPrivateMessagesBetweeen2users =
      privateChatController.fetchAllPrivateMessagesBetween2Users(
        1,
        50,
        true,
        'testUserId1',
        'testUserId2',
      );
    let allPrivateMessagesParticipants =
      privateChatController.fetchAllPrivateMessagesParticipants(
        1,
        50,
        true,
        'testUserId2',
      );
    let allPrivateMessagesSinceLastOnline =
      privateChatController.fetchAllPrivateMessagesSinceLastOnline(
        1,
        50,
        true,
        'testUserId1',
      );
    expect(fetchAllMessagesPrivate).toBeCalledTimes(2);
    expect(fetchOnlineStatusOf).toBeCalledTimes(1);
  });
  test('Update Read Status: updateReadStatus', async () => {
    let result = privateChatController.updateReadStatus(
      'testUserId1',
      'testUserId2',
    );
    expect(sendReadMessage).toBeCalledTimes(0);
    expect(updateReadStatus).toBeCalledTimes(1);
  });
});
