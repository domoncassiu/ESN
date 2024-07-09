import HandledError from './HandledError.js';

class InvalidEntryError extends HandledError {
  code = 400;
  constructor() {
    super('Invalid data');
  }
}

export default InvalidEntryError;
