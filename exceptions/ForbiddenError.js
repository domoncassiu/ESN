import HandledError from './HandledError.js';

class ForbiddenError extends HandledError {
  code = 403;
  constructor(message = 'Forbidden.') {
    super(message);
  }
}

export default ForbiddenError;
