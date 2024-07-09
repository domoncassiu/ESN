import HandledError from './HandledError.js';

class WebsocketSubsystemError extends HandledError {
  code = 500;
  constructor() {
    super('Websocket Subsystem: Internal Server Error');
  }
}

export default WebsocketSubsystemError;
