import { expect, jest, test } from '@jest/globals';
import SafetyStatus from '../../../models/SafetyStatus';
import SafetyStatusEnum from '../../../models/SafetyStatusEnum';
import PublicChatController from '../../../controllers/PublicChatController';
import TestDBClient from '../../../clients/TestDBClient';
import WebsocketSubsystem from '../../../subsystems/WebsocketSubsystem';
import PublicMessage from '../../../models/PublicMessage';
import State from '../../../bin/State';
import ModeEnum from '../../../bin/ModeEnum';
import AuthenticatedUser from '../../../models/AuthenticatedUser';
import CurrentUserState from '../../../models/CurrentUserState';

let publicChatController = new PublicChatController(TestDBClient.getInstance());

// Mock functions
let fetchMostRecentSafetyStatus = jest
  .spyOn(SafetyStatus, 'fetchMostRecentSafetyStatus')
  .mockReturnValue(SafetyStatusEnum.OK);

let insertThisMessage = jest
  .spyOn(PublicMessage.prototype, 'insertThisMessage')
  .mockReturnValue(undefined);

let sendPublicMessage = jest
  .spyOn(WebsocketSubsystem.prototype, 'sendPublicMessage')
  .mockImplementation(() => {
    console.log('mocked function');
  });

let fetchAllMessagesPublic = jest
  .spyOn(PublicMessage, 'fetchAllPublicMessages')
  .mockImplementation(() => [
    {
      messageId: '12345',
      senderId: 'testUserId',
      message: 'Hello, world!',
      safetyStatus: SafetyStatusEnum.OK,
      timestamp: 1711581345192,
    },
  ]);

let getAllCurrentUsersStates = jest
  .spyOn(CurrentUserState, 'getAllCurrentUsersStates')
  .mockImplementation(() => [
    {
      userId: 'testUserId',
      isActive: true,
    },
  ]);

State.getInstance().mode = ModeEnum.PRODUCTION;
State.getInstance().websocketSubsystem = new WebsocketSubsystem();

let findAllUsers = jest
  .spyOn(AuthenticatedUser, 'findAllUsers')
  .mockImplementation(() => [
    {
      username: 'mary',
      _id: 'testUserId',
    },
  ]);

describe('Testing controller: PublicChatController', () => {
  test('Publish a public message: addPublicMessage', async () => {
    let publishedMessage = await publicChatController.addPublicMessage(
      'testUserId',
      'testUsername',
      'Hello, World!',
    );
    expect(fetchMostRecentSafetyStatus).toBeCalledTimes(1);
    expect(sendPublicMessage).toBeCalledTimes(1);
    expect(insertThisMessage).toBeCalledTimes(1);
    expect(publishedMessage.senderId).toStrictEqual('testUserId');
    expect(publishedMessage.message).toStrictEqual('Hello, World!');
  });
  test('Fetch all public messages: fetchAllPublicMessages', async () => {
    let publicMessages = await publicChatController.fetchAllPublicMessages(
      1,
      50,
      false,
    );
    expect(fetchAllMessagesPublic).toBeCalledTimes(1);
    expect(getAllCurrentUsersStates).toBeCalled();
    expect(findAllUsers).toBeCalled();
    expect(publicMessages).toStrictEqual([
      {
        message: 'Hello, world!',
        messageId: '12345',
        safetyStatus: 'OK',
        senderId: 'testUserId',
        timestamp: 1711581345192,
        username: 'mary',
      },
    ]);
  });
});
