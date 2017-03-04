import {LIGHT_PROTOCOL_MAPPING} from './constants';

import {SECONDS_PER_MINUTE, MINUTE_PER_HOUR, MILLS_PER_SECOND, SECONDS_PER_DAY} from './constants';

class LightController {
  constructor (options) {
    const {light, timer, durationInSec = 0.5 * MINUTE_PER_HOUR * SECONDS_PER_MINUTE} = options;
    if (light == undefined || timer == undefined) {
      throw new Error('Light and Timer are required');
    }

    this.light = light;

    this.light.onColorChange(() => {
      this.log();
    });

    this.timer = timer;
    this.durationInSec = durationInSec;

    // here we initialize the first log, consider of duration limitation, 'until' should be <= 'durationInSec'
    this.logs = [{
      from: timer.getTimeStr(),
      until: timer.getTimeStr(timer.initialTimeOfSecsInADay + Math.min(this.getCurrentProtocol().duration, durationInSec)),
      lightColor: light.color,
    }];
  }

  getCurrentProtocol () {
    return LIGHT_PROTOCOL_MAPPING.find(item => item.color === this.light.color);
  }

  getNextProtocol () {
    const currentColor = this.getCurrentProtocol().color;
    const colors = LIGHT_PROTOCOL_MAPPING.map(item => item.color);
    const nextProtocolIndex = (colors.indexOf(currentColor) + 1 ) % LIGHT_PROTOCOL_MAPPING.length;
    return LIGHT_PROTOCOL_MAPPING[nextProtocolIndex];
  }

  async loop () {
    if (this.timer.getPassedDurationInSec() >= this.durationInSec) {
      return;
    }

    await this.executeCurrentProtocol();
    return this.loop();
  }

  log () {
    let fromString = this.timer.getTimeStr();
    const untilSec = Math.min(this.timer._passedDays * SECONDS_PER_DAY + this.timer.getTimeInSec() + this.getCurrentProtocol().duration, this.durationInSec + this.timer.initialTimeOfSecsInADay);
    let untilString = this.timer.getTimeStr(untilSec);

    // here is for edge case consideration,
    // the last stop time should be in the duration limitation
    if (this.timer.getPassedDurationInSec() > this.durationInSec) {
      return;
    }

    if (fromString === untilString) {
      return;
    }

    const lightColor = this.light.color;

    this.logs.push({from: fromString, until: untilString, lightColor});
  }

  async executeCurrentProtocol () {
    const currentProtocol = this.getCurrentProtocol();
    const nextProtocol = this.getNextProtocol();

    const timeOutToTurnColorInSec = currentProtocol.duration;

    return new Promise(resolve => {
      this.timer.setTimeout(() => {
        this.light.turn(nextProtocol.color);
        resolve();
      }, timeOutToTurnColorInSec * MILLS_PER_SECOND);
    });
  }
}

export default LightController;