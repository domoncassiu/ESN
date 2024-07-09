import AuthenticatedUser from '../models/AuthenticatedUser.js';
import InvalidEntryError from '../exceptions/InvalidEntryError.js';
import InternalServerError from '../exceptions/InternalServerError.js';
import secrets from '../secrets.js';
import bcrypt from 'bcrypt';
import UserAlreadyExistsError from '../exceptions/UserAlreadyExistsError.js';
import UnauthenticatedUser from '../models/UnauthenticatedUser.js';
import UnauthorizedError from '../exceptions/UnauthorizedError.js';

class LoginController {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  async findUser(unauthenticatedUser) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await unauthenticatedUser.getThisUsersData());
      } catch (e) {
        reject(new InvalidEntryError());
      }
    });
  }

  async authenticateUser(unauthenticatedUser) {
    if (!unauthenticatedUser.isValid()) {
      throw new InvalidEntryError();
    }
    return new Promise(async (resolve, reject) => {
      let authenticatedUser = null;

      try {
        authenticatedUser = await this.findUser(unauthenticatedUser);
        bcrypt.compare(
          unauthenticatedUser.password,
          authenticatedUser.password,
          async function (err, result) {
            if (err) {
              reject(new InternalServerError());
            } else if (result === false) {
              console.log('reject attempt');
              reject(new UnauthorizedError());
            } else {
              resolve(authenticatedUser);
            }
          },
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  async addUser(unauthenticatedUser) {
    if (!unauthenticatedUser.isValid()) {
      throw new InvalidEntryError();
    }
    try {
      await this.findUser(unauthenticatedUser);
    } catch (e) {
      // user does not exist, so create new user
      return new Promise((resolve, reject) => {
        let that = this;
        // hash password and store new user in user collection
        bcrypt.hash(
          unauthenticatedUser.password,
          secrets.passwordHashSaltRounds,
          async function (err, hash) {
            if (err) {
              console.error(err);
              reject(new InternalServerError());
            } else {
              let newUser = new AuthenticatedUser(
                that.dbClient,
                unauthenticatedUser.username,
                hash,
              );
              resolve(newUser.insertThisUser());
            }
          },
        );
      });
    }

    // user already exists
    throw new UserAlreadyExistsError();
  }

  async updateAcknowledgeTermsStatus(username, isAcknowledged) {
    try {
      let userConcerned = new UnauthenticatedUser(
        this.dbClient,
        username,
        'not used',
      );
      let authenticatedUser = await this.findUser(userConcerned);
      let isUpdated =
        await authenticatedUser.updateAcknowledgeTermsStatus(isAcknowledged);
      return isUpdated;
    } catch (error) {
      throw error;
    }
  }

  async retrieveUserAcknowledged(username) {
    try {
      let userConcerned = new UnauthenticatedUser(
        this.dbClient,
        username,
        'not used',
      );
      let authenticatedUser = await this.findUser(userConcerned);
      let userAcknowledged = await authenticatedUser.acknowledged;
      return userAcknowledged;
    } catch (error) {
      throw error;
    }
  }
}

export default LoginController;
