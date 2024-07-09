import State from '../bin/State.js';
import ModeEnum from '../bin/ModeEnum.js';

class EsnTestController {
  async activateTest() {
    await State.getInstance().activateMode(ModeEnum.TEST);

    // broadcast that testing is active, then UI should log everyone out
    await State.getInstance().websocketSubsystem.sendTestingAlert();
  }

  async deactivateTest() {
    try {
      if (State.getInstance().mode == ModeEnum.TEST) {
        await State.getInstance().dbClient.deleteAll('PublicMessage');
      }
    } catch (error) {
      console.error('Failed to delete all public messages:', error);
    }

    await State.getInstance().activateMode(ModeEnum.PRODUCTION);

    // broadcast that testing has stopped
    await State.getInstance().websocketSubsystem.sendTestingStoppedAlert();
  }
}

export default EsnTestController;
