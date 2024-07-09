import HandledError from './HandledError.js';

class ValidationError extends HandledError {
  code = 400;
  constructor(message) {
    super(message);
  }
}

export default ValidationError;
