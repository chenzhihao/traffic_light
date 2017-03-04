import Light from './Light';
import {COLORS} from './constants';
import Timer from './Timer';
import LightController from './LightController';

const inputArgs = {startTimeStr: process.argv[2], durationInSec: process.argv[3] && Number(process.argv[3])};
const {startTimeStr = '00:00:00', durationInSec = 1800} = inputArgs;

const northSouthLight = new Light({initialColor: COLORS.RED});
const eastWestLight = new Light({initialColor: COLORS.GREEN});

const timer = new Timer({initialTimeStr: startTimeStr, durationInSec});

const northSouthLightController = new LightController({light: northSouthLight, timer: timer});
const eastWestLightController = new LightController({light: eastWestLight, timer: timer});

timer.start().then(function () {
  console.log('Start time:', startTimeStr);
  console.log('Duration seconds', durationInSec);
  console.log('================');
  console.log('North-South Light:');
  northSouthLightController.logs.forEach(log => console.log(log));
  console.log('================');
  console.log('East-West Light:');
  eastWestLightController.logs.forEach(log => console.log(log));
})
  .catch(err => console.log(err));
