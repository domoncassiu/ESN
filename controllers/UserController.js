import InternalServerError from '../exceptions/InternalServerError.js';
import CurrentUserState from '../models/CurrentUserState.js';
import SafetyStatus from '../models/SafetyStatus.js';
import State from '../bin/State.js';
import AuthenticatedUser from '../models/AuthenticatedUser.js';
import secrets from '../secrets.js';
import bcrypt from 'bcrypt';
import UserType from '../models/UserType.js';
import SafetyStatusEnum from '../models/SafetyStatusEnum.js';

class UserController {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  async getEsnDirectory(page, pageSize, ascending) {
    return new Promise(async (resolve, reject) => {
      try {
        let results = await CurrentUserState.getAllCurrentUsersStates(
          this.dbClient,
          page,
          pageSize,
          ascending,
        );
        resolve(results);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async getUserSafetyStatus(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await SafetyStatus.fetchMostRecentSafetyStatus(
          this.dbClient,
          userId,
        );
        resolve(result);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async updateUserSafetyStatus(userId, username, status) {
    return new Promise(async (resolve, reject) => {
      try {
        let newSafetyStatus = new SafetyStatus(
          this.dbClient,
          userId,
          status,
          Date.now(),
        );
        let result = await newSafetyStatus.setUserSafetyStatus();
        // TODO
        await State.getInstance().websocketSubsystem.onSafetyStatusChange(
          status,
          username,
        );
        resolve(result);
      } catch (err) {
        console.error(err);
        reject(new InternalServerError());
      }
    });
  }

  async getUserType(_id) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await AuthenticatedUser.getUserById(this.dbClient, _id);
        resolve(result.type);
      } catch (e) {
        console.log(e);
        reject(new InternalServerError());
      }
    });
  }

  async getUserByName(username) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await AuthenticatedUser.getUserByUsername(
          this.dbClient,
          username,
        );
        resolve(result);
      } catch (e) {
        console.log(e);
        reject(new InternalServerError());
      }
    });
  }

  async updateUser(idToUpdate, updatedFields) {
    return new Promise(async (resolve, reject) => {
      try {
        if (updatedFields.password) {
          try {
            const hash = await bcrypt.hash(
              updatedFields.password,
              secrets.passwordHashSaltRounds,
            );
            updatedFields.password = hash;
            console.log('Hashed Password:', hash);
          } catch (err) {
            console.error(err);
            reject(new InternalServerError());
            return;
          }
        }
        let user = await AuthenticatedUser.getUserById(
          this.dbClient,
          idToUpdate,
        );
        const filter = { _id: idToUpdate };
        console.log(updatedFields);
        const result = await AuthenticatedUser.updateUser(
          this.dbClient,
          filter,
          updatedFields,
        );
        let authenticatedUser = new AuthenticatedUser(
          this.dbClient,
          result.username,
          'unused',
          result.type,
          result.acknowledged,
          result.isActive,
          result.memberOfIncidentIds,
          result._id,
        );
        let token = null;
        if (user.type !== updatedFields.type) {
          authenticatedUser.type = user.type;
          token = authenticatedUser.getNewToken();
        } else {
          token = authenticatedUser.getNewToken();
        }
        await State.getInstance().websocketSubsystem.onUserInfoUpdate(
          idToUpdate,
          updatedFields.isActive,
          token,
        );
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  }

  async hasMoreThanOneAdmin() {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await AuthenticatedUser.findAllUsers(this.dbClient, {
          type: UserType.ADMIN,
        });
        resolve(result.length > 1);
      } catch (e) {
        console.log(e);
        reject(new InternalServerError());
      }
    });
  }

  async initializeAdmin() {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await AuthenticatedUser.getUserByUsername(
          this.dbClient,
          'esnadmin',
        );
        if (!result) {
          const hashedPassword = await bcrypt.hash(
            'admin',
            secrets.passwordHashSaltRounds,
          );
          await new AuthenticatedUser(
            this.dbClient,
            'esnadmin',
            hashedPassword,
            UserType.ADMIN,
          ).insertThisUser();
          await new SafetyStatus(
            this.dbClient,
            'esnadmin',
            SafetyStatusEnum.OK,
            Date.now(),
          ).setUserSafetyStatus();
        }
        resolve();
      } catch (e) {
        console.log(e);
        reject(new InternalServerError());
      }
    });
  }
}

export default UserController;
