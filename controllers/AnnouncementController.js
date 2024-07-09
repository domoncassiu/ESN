import Announcement from '../models/Announcement.js';
import InternalServerError from '../exceptions/InternalServerError.js';
import { uuid } from 'uuidv4';
import State from '../bin/State.js';
import AuthenticatedUser from '../models/AuthenticatedUser.js';
import CurrentUserState from '../models/CurrentUserState.js';

class AnnouncementController {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  async fetchAllAnnouncements(page, pageSize, ascending) {
    return new Promise(async (resolve, reject) => {
      try {
        let announcements = await Announcement.fetchAllAnnouncements(
          this.dbClient,
          page,
          pageSize,
          ascending,
        );
        let mappedAnnouncements = await Promise.all(
          announcements.map(async (result) => {
            let announcement = new Announcement(
              this.dbClient,
              result.announcementId,
              result.userId,
              result.message,
              result.timestamp,
            );
            delete announcement.announcementDAO;
            delete announcement.dbClient;
            let sender = await AuthenticatedUser.getUserById(
              this.dbClient,
              announcement.userId,
            );
            announcement.sender = sender.username;
            return announcement;
          }),
        );
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
        let filteredArrayData = mappedAnnouncements.filter((data) =>
          filteredUserList.includes(data.userId),
        );
        resolve(filteredArrayData);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async addNewAnnouncement(userId, message) {
    return new Promise(async (resolve, reject) => {
      try {
        let announcement = new Announcement(
          this.dbClient,
          uuid(),
          userId,
          message,
          Date.now(),
        );
        let retrievedUser = await AuthenticatedUser.getUserById(
          this.dbClient,
          userId,
        );
        announcement.sender = retrievedUser.username;
        await State.getInstance().websocketSubsystem.sendPublicAnnouncement(
          announcement,
        );
        await announcement.insertThisAnnoucement();
        resolve(announcement);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }
}

export default AnnouncementController;
