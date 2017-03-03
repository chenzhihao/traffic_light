import Light from './Light';
import {COLORS} from './constants';
import Timer from './Timer';
import LightController from './LightController';

let startTimeStr = process.argv[2] || '00:00:00';
let durationInSec = process.argv[3] || 1800;

const northSouthLight = new Light({initialColor: COLORS.RED});
const eastWestLight = new Light({initialColor: COLORS.GREEN});

const northSouthTimer = new Timer({initialTimeStr: startTimeStr});
const eastWestTimer = new Timer({initialTimeStr: startTimeStr});

const northSouthLightController = new LightController({light: northSouthLight, timer: northSouthTimer, durationInSec});
const eastWestLightController = new LightController({light: eastWestLight, timer: eastWestTimer, durationInSec});

Promise.all([northSouthLightController.loop(), eastWestLightController.loop()])
  .then(function () {
    console.log('North-South Light:');
    northSouthLightController.logs.forEach(log => console.log(log));
    console.log('================');
    console.log('East-West Light:');
    northSouthLightController.logs.forEach(log => console.log(log));

  })
  .catch(err => console.log(err));

