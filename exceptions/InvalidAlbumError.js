import HandledError from './HandledError.js';

class InvalidAlbumError extends HandledError {
  code = 400;
  constructor() {
    super('Invalid Album.');
  }
}

export default InvalidAlbumError;
