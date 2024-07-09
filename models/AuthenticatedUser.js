import InvalidEntryError from '../exceptions/InvalidEntryError.js';
import DatabaseError from '../exceptions/DatabaseError.js';
import Auth from '../middleware/auth.js';
import User from './User.js';
import UserType from './UserType.js';
import UserDAO from '../dao/UserDAO.js';
import { ObjectId } from 'mongodb';

class AuthenticatedUser extends User {
  userDAO = null;

  constructor(
    dbClient,
    username,
    password,
    type = UserType.CITIZEN,
    acknowledged = false,
    isActive = true,
    memberOfIncidentIds = [],
    _id = null,
  ) {
    super(username);
    this.password = password;
    this.type = type;
    this.acknowledged = acknowledged;
    this.isActive = isActive;
    this.memberOfIncidentIds = memberOfIncidentIds;
    this.userDAO = new UserDAO(dbClient);
    this._id = _id;
  }

  getUserId() {
    return this._id.toString();
  }

  async updateAcknowledgeTermsStatus(hasAcknowledged) {
    this.acknowledged = hasAcknowledged;
    if (!this.isValid()) {
      throw new InvalidEntryError();
    }
    // in users.js file "User" = "AuthenticatedUser.schemaModel"
    try {
      let isUpdated = false;
      const filter = { username: this.username };
      const update = { acknowledged: hasAcknowledged };
      const options = {
        upsert: false,
        includeResultMetadata: true,
        new: true,
      };
      const userUpdateResult = await this.userDAO.update(
        filter,
        update,
        options,
      );
      // If no existing documents were updated or no document found
      if (
        !userUpdateResult.lastErrorObject.updatedExisting ||
        userUpdateResult.value == null
      ) {
        throw new InvalidEntryError();
      } else {
        return (isUpdated = true);
      }
    } catch (error) {
      throw new DatabaseError();
    }
  }

  async getNewToken() {
    return await Auth.getInstance().generateToken(this);
  }

  async insertThisUser() {
    try {
      await this.userDAO.create(this);
      const result = await this.userDAO.read({ username: this.username });
      this._id = result._id;
      return this;
    } catch (err) {
      throw new DatabaseError();
    }
  }

  async removeSelfFromIncident(incidentId) {
    console.log(
      `User ${this.getUserId()} is currently a member of ${this.memberOfIncidentIds}`,
    );
    console.log(
      `Removing incident ${incidentId} from memberOfIncidentIds list.`,
    );
    try {
      if (
        this.memberOfIncidentIds === undefined ||
        this.memberOfIncidentIds === null
      ) {
        this.memberOfIncidentIds = [];
      }
      let index = this.memberOfIncidentIds.indexOf(incidentId);
      if (index < 0) {
        throw new InvalidEntryError();
      }
      this.memberOfIncidentIds.splice(index, 1);
      const filter = { _id: this._id };
      const update = { memberOfIncidentIds: this.memberOfIncidentIds };
      const options = {
        upsert: false,
        includeResultMetadata: true,
        new: true,
      };
      return await this.userDAO.update(filter, update, options);
    } catch (err) {
      console.error(err);
      throw new DatabaseError();
    }
  }

  async becomeMemberOfIncident(incidentId) {
    console.log('incidentId: ', incidentId);
    if (this.memberOfIncidentIds === undefined) {
      this.memberOfIncidentIds = [incidentId];
    } else {
      if (!this.memberOfIncidentIds.includes(incidentId)) {
        this.memberOfIncidentIds.push(incidentId);
      } else {
        return;
      }
    }
    console.log('this.memberOfIncidentIds: ', this.memberOfIncidentIds);
    try {
      const filter = { username: this.username };
      const update = { memberOfIncidentIds: this.memberOfIncidentIds };
      const options = {
        upsert: false,
        includeResultMetadata: true,
        new: true,
      };
      return await this.userDAO.update(filter, update, options);
    } catch (err) {
      throw new DatabaseError();
    }
  }

  static async getUserById(dbClient, idString) {
    return await new UserDAO(dbClient).read({ _id: idString });
  }

  static async getUserByUsername(dbClient, username) {
    return await new UserDAO(dbClient).read({ username: username });
  }

  static async updateUser(dbClient, filter, update) {
    return await new UserDAO(dbClient).update(filter, update);
  }

  static async findAllUsers(dbClient, condition) {
    return await new UserDAO(dbClient).readAll(condition);
  }

  isValid() {
    return (
      super.isValid() &&
      this.password !== null &&
      this.password !== undefined &&
      (this.acknowledged === true || this.acknowledged === false) &&
      (this.isActive === true || this.isActive === false)
    );
  }
}

export default AuthenticatedUser;
