class User {
  constructor(username) {
    this.username = username;
  }

  isValid() {
    return this.username !== null && this.username !== undefined;
  }
}

export default User;
