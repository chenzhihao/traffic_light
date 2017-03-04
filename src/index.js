import Light from './src/Light';
import {COLORS} from './src/constants';
import Timer from './src/Timer';
import LightController from './src/LightController';

let startTimeStr = process.argv[2] || '00:00:00';
let durationInSec = process.argv[3] || 1800;

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
