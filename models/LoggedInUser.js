import User from './User.js';

class LoggedInUser extends User {
  constructor(username, _id, type) {
    super(username);
    this._id = _id;
    this.type = type;
  }

  isValid() {
    return (
      super.isValid() &&
      this.type !== null &&
      this.type !== undefined &&
      this._id !== null &&
      this._id !== undefined
    );
  }
}
export default LoggedInUser;
