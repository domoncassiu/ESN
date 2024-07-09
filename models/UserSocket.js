import UserSocketDAO from '../dao/UserSocketDAO.js';
import DatabaseError from '../exceptions/DatabaseError.js';

class UserSocket {
  userSocketDAO = null;
  constructor(dbClient, username, socketid) {
    this.username = username;
    this.socketid = socketid;
    this.userSocketDAO = new UserSocketDAO(dbClient);
  }

  static async getSocketIdForUser(dbClient, username) {
    try {
      console.log(username);
      let usersocket = await new UserSocketDAO(dbClient).read({
        username: username,
      });
      console.log(usersocket);
      return usersocket;
    } catch (error) {
      throw new DatabaseError();
    }
  }

  async addThisUserSocketId() {
    try {
      await this.userSocketDAO.create(this);
    } catch (error) {
      throw new DatabaseError();
    }
  }

  async deleteThisUserSocketId() {
    try {
      console.log(this.username);
      await this.userSocketDAO.delete(this.username);
    } catch (error) {
      throw new DatabaseError();
    }
  }
  async updateThisUserSocketId() {
    try {
      let isUpdated = false;
      let filter = { username: this.username };
      let update = {
        username: this.username,
        socketid: this.socketid,
      };
      let options = {
        upsert: true,
        setDefaultsOnInsert: false,
      };
      const result = await this.userSocketDAO.update(filter, update, options);
      isUpdated = true;
      return isUpdated;
    } catch (err) {
      console.error(err);
      throw new DatabaseError();
    }
  }
}

export default UserSocket;
