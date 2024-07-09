import HandledError from './HandledError.js';

class DatabaseError extends HandledError {
  code = 500;
  constructor() {
    super('Database error');
  }
}

export default DatabaseError;
