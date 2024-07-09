import { expect, jest, test } from '@jest/globals';
import AnnouncementController from '../../../controllers/AnnouncementController';
import TestDBClient from '../../../clients/TestDBClient';
import WebsocketSubsystem from '../../../subsystems/WebsocketSubsystem';
import Announcement from '../../../models/Announcement';
import State from '../../../bin/State';
import AuthenticatedUser from '../../../models/AuthenticatedUser';
import CurrentUserState from '../../../models/CurrentUserState';

let announcementController = new AnnouncementController(
  TestDBClient.getInstance(),
);

// Mock functions
let insertThisAnnouncement = jest
  .spyOn(Announcement.prototype, 'insertThisAnnoucement')
  .mockReturnValue(undefined);

let sendPubliceAnnouncement = jest
  .spyOn(WebsocketSubsystem.prototype, 'sendPublicAnnouncement')
  .mockImplementation(() => {
    console.log('mocked function');
  });

let fetchAllAnnouncements = jest
  .spyOn(Announcement, 'fetchAllAnnouncements')
  .mockImplementation(() => [
    {
      announcementId: '12345',
      userId: '123',
      message: 'Hello, world!',
      timestamp: 1711581345192,
    },
  ]);

let getUserById = jest
  .spyOn(AuthenticatedUser, 'getUserById')
  .mockImplementation(() => [
    {
      username: 'mary',
    },
  ]);

let getAllCurrentUsersStates = jest
  .spyOn(CurrentUserState, 'getAllCurrentUsersStates')
  .mockImplementation(() => [
    {
      userId: '123',
      isActive: true,
    },
  ]);

State.getInstance().websocketSubsystem = new WebsocketSubsystem();

describe('Testing controller: AnnouncementController', () => {
  test('Publish an announcement: addNewAnnouncement', async () => {
    let announcement = await announcementController.addNewAnnouncement(
      '123',
      'Hello, World!',
    );
    console.log('woo', announcement);
    expect(sendPubliceAnnouncement).toBeCalledTimes(1);
    expect(insertThisAnnouncement).toBeCalledTimes(1);
    expect(getUserById).toBeCalledTimes(1);
    expect(announcement.sender).toStrictEqual(undefined);
    expect(announcement.message).toStrictEqual('Hello, World!');
  });
  test('Fetch all announcements: fetchAllAnnouncements', async () => {
    let announcements = await announcementController.fetchAllAnnouncements();
    expect(fetchAllAnnouncements).toBeCalledTimes(1);
    expect(announcements[0].userId).toStrictEqual('123');
    expect(announcements[0].message).toStrictEqual('Hello, world!');
  });
});
