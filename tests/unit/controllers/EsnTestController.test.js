import { expect, jest, test } from '@jest/globals';
import WebsocketSubsystem from '../../../subsystems/WebsocketSubsystem';
import State from '../../../bin/State';
import ModeEnum from '../../../bin/ModeEnum';
import esntest from '../../../routes/esntest';
import EsnTestController from '../../../controllers/EsnTestController';
import TestDBClient from '../../../clients/TestDBClient';

// Mock functions
let sendTestingAlert = jest
  .spyOn(WebsocketSubsystem.prototype, 'sendTestingAlert')
  .mockImplementation(() => {
    console.log(
      'mocked function: WebsocketSubsystem.prototype.sendTestingAlert',
    );
  });

let sendTestingStoppedAlert = jest
  .spyOn(WebsocketSubsystem.prototype, 'sendTestingStoppedAlert')
  .mockImplementation(() => {
    console.log(
      'mocked function: WebsocketSubsystem.prototype.sendTestingStoppedAlert',
    );
  });

let deleteAll = jest
  .spyOn(TestDBClient.prototype, 'deleteAll')
  .mockImplementation(() => {});

State.getInstance().mode = ModeEnum.PRODUCTION;
State.getInstance().websocketSubsystem = new WebsocketSubsystem();

let esnTestController = new EsnTestController();

describe('Test Controller: EsnTestController', () => {
  test('Activate Test Mode: activateTest', async () => {
    await esnTestController.activateTest();
    expect(State.getInstance().mode === ModeEnum.TEST);
    expect(sendTestingAlert).toBeCalledTimes(1);
  });
  test('Deactivate Test Mode: deactivateTest', async () => {
    await esnTestController.deactivateTest();
    expect(State.getInstance().mode === ModeEnum.PRODUCTION);
    expect(sendTestingStoppedAlert).toBeCalledTimes(1);
    expect(deleteAll).toBeCalledTimes(1);
  });
});
