import HandledError from './HandledError.js';

class UserAlreadyExistsError extends HandledError {
  code = 409;
  constructor() {
    super('This user already exists.');
  }
}

export default UserAlreadyExistsError;
