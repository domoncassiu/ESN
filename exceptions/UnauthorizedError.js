import HandledError from './HandledError.js';

class UnauthorizedError extends HandledError {
  code = 401;
  constructor() {
    super('Please re-enter the username and/or password.');
  }
}

export default UnauthorizedError;
