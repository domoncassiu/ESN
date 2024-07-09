import User from './User.js';
import InvalidEntryError from '../exceptions/InvalidEntryError.js';
import UserDAO from '../dao/UserDAO.js';
import AuthenticatedUser from './AuthenticatedUser.js';

class UnauthenticatedUser extends User {
  userDAO = null;

  constructor(dbClient, username, password) {
    super(username);
    this.password = password;
    this.userDAO = new UserDAO(dbClient);
  }

  isValid() {
    return super.isValid();
  }

  async getThisUsersData() {
    if (!this.isValid()) {
      throw new InvalidEntryError();
    }
    let result = await this.userDAO.read({ username: this.username });
    if (result === null) {
      throw new InvalidEntryError();
    }
    return new AuthenticatedUser(
      this.userDAO.dbClient,
      result.username,
      result.password,
      result.type,
      result.acknowledged,
      result.isActive,
      result.memberOfIncidentIds,
      result._id,
    );
  }
}

export default UnauthenticatedUser;
