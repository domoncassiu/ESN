import HandledError from './HandledError.js';

class ImageDeleteError extends HandledError {
  code = 400;
  constructor() {
    super('Not Ownder of Image.');
  }
}

export default ImageDeleteError;
