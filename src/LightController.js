import {LIGHT_PROTOCOL_MAPPING} from './constants';

import {SECONDS_PER_DAY} from './constants';

class LightController {
  constructor (options) {
    const {light, timer} = options;
    if (light == undefined || timer == undefined) {
      throw new Error('Light and Timer are required');
    }

    this.light = light;
    this.light.onColorChange(() => {
      this._addLog();
    });

    this.timer = timer;
    this._setTimerLaterTask();

    // Initialize the first log. Consider of durationInSec limitation, 'until' should be <= 'durationInSec'
    this.logs = [{
      from: timer.getTimeStr(),
      until: timer.getTimeStr(timer.initialTimeOfSecsInADay + Math.min(this.getCurrentProtocol().durationInSec, timer.durationInSec)),
      lightColor: light.color,
    }];

  }

  /**
   * Set timer 'onLater' callback, so we can change light color on at specify time later
   * @private
   */
  _setTimerLaterTask () {
    const currentProtocol = this.getCurrentProtocol();
    const nextProtocol = this.getNextProtocol();
    const me = this;

    this.timer.onLater(function () {
      // when the timer is already at then end of durationInSec, we should not add task anymore
      if (me.timer.getPassedDurationInSec() >= me.timer.durationInSec) {
        return;
      }

      me.light.turn(nextProtocol.color);
      me._setTimerLaterTask();
    }, currentProtocol.durationInSec)
  }

  /**
   * Get current light status info: {color, durationInSec};
   * @returns {color, durationInSec}
   */
  getCurrentProtocol () {
    return LIGHT_PROTOCOL_MAPPING.find(item => item.color === this.light.color);
  }

  /**
   * Get next light status info: {color, durationInSec};
   * @returns {color, durationInSec}
   */
  getNextProtocol () {
    const currentColor = this.getCurrentProtocol().color;
    const colors = LIGHT_PROTOCOL_MAPPING.map(item => item.color);
    const nextProtocolIndex = (colors.indexOf(currentColor) + 1 ) % LIGHT_PROTOCOL_MAPPING.length;
    return LIGHT_PROTOCOL_MAPPING[nextProtocolIndex];
  }

  /**
   * Add a log object like {from: '01:00:00', until:'01:04:30', lightColor: 'green'}
   * @private
   */
  _addLog () {
    const untilSec = Math.min(this.timer.passedDays * SECONDS_PER_DAY + this.timer.getTimeInSec() + this.getCurrentProtocol().durationInSec, this.timer.durationInSec + this.timer.initialTimeOfSecsInADay);
    const untilString = this.timer.getTimeStr(untilSec);

    this.logs.push({from: this.timer.getTimeStr(), until: untilString, lightColor: this.light.color});
  }
}

export default LightController;