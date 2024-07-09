import HandledError from './HandledError.js';

class NotFoundError extends HandledError {
  code = 404;
  constructor() {
    super('Not Found.');
  }
}

export default NotFoundError;
