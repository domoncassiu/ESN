import HandledError from './HandledError.js';

class NonTestUserDuringTest extends HandledError {
  code = 503;
  constructor() {
    super('Website is undergoing Speed Test. Please wait.');
  }
}

export default NonTestUserDuringTest;
