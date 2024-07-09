import ModeEnum from './ModeEnum.js';
import MongooseDBClient from '../clients/MongooseDBClient.js';
import WebsocketSubsystem from '../subsystems/WebsocketSubsystem.js';
import TestDBClient from '../clients/TestDBClient.js';

export default class State {
  async activateMode(modeEnum) {
    switch (modeEnum) {
      case ModeEnum.TEST:
        this.mode = ModeEnum.TEST;
        this.dbClient = await TestDBClient.getInstance();
        console.log('Activated TEST mode. ');
        break;
      case ModeEnum.PRODUCTION:
        this.mode = ModeEnum.PRODUCTION;
        this.dbClient = await MongooseDBClient.getInstance();
        console.log('Activated PRODUCTION mode. ');
        break;
      default:
      // do nothing
    }
  }

  async setServer(server) {
    this.server = server;
    this.websocketSubsystem = await new WebsocketSubsystem(
      this.dbClient,
      this.server,
      this.websocketOptions,
    );
    await this.websocketSubsystem.initialize();
  }

  constructor() {
    this.mode = ModeEnum.PRODUCTION;
    this.server = null;
    this.websocketOptions = {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['authorization'],
      },
      // credentials: true,
    };

    // defaults to production
    this.dbClient = MongooseDBClient.getInstance();
    this.websocketSubsystem = null;
  }

  static instance = null;
  static getInstance() {
    if (State.instance === null || State.instance === undefined) {
      State.instance = new State();
    }
    return State.instance;
  }
}
