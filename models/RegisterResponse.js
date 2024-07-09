class RegisterResponse {
  constructor(accessToken, username) {
    this.accessToken = accessToken;
    this.username = username;
  }

  getJSONString() {
    return JSON.stringify({
      access_token: this.accessToken,
      username: this.username,
    });
  }
}

export default RegisterResponse;
