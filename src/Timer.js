import {SECONDS_PER_MINUTE, MINUTE_PER_HOUR, SECONDS_PER_DAY, MILLS_PER_SECOND} from './constants';

class Timer {
  constructor (options) {
    const {initialTimeStr = '00:00:00'} = options;

    if (!/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(initialTimeStr)) {
      throw new Error('Time format should be HH:MM:SS, from 00:00:00 to 23:59:59');
    }

    this.initialTimeStr = initialTimeStr;

    const {hours, mins, secs} = this._parseTimeStringToObject(this.initialTimeStr);

    this._timeOfSecsInADay = secs + mins * SECONDS_PER_MINUTE + hours * SECONDS_PER_MINUTE * MINUTE_PER_HOUR;
    this.initialTimeOfSecsInADay = this._timeOfSecsInADay;
    this._passedDays = 0;

    // use the Proxy pattern, so we can automatically do passedDay control
    Object.defineProperty(this, 'timeOfSecsInADay', {
      get () {
        return this._timeOfSecsInADay;
      },

      set (timeOfSecsInADay) {
        if (timeOfSecsInADay >= SECONDS_PER_DAY) {
          this._passedDays += timeOfSecsInADay / SECONDS_PER_DAY;
          this._timeOfSecsInADay = timeOfSecsInADay % SECONDS_PER_DAY;
        } else {
          this._timeOfSecsInADay = timeOfSecsInADay;
        }
      }
    });
  }

  getPassedDurationInSec () {
    return this.getTimeInSec() - this.initialTimeOfSecsInADay + this._passedDays * SECONDS_PER_DAY;
  }

  _parseTimeStringToObject (timeStr) {
    const timeArr = timeStr.split(':').map(item => parseInt(item));
    const hours = timeArr[0];
    const mins = timeArr[1];
    const secs = timeArr[2];
    return {hours, mins, secs};
  }

  nextTickSec () {
    this.timeOfSecsInADay++;
  }

  getTimeInSec () {
    return this.timeOfSecsInADay;
  }

  /**
   * Get current time in str, the format should be "HH:MM:SS"
   * for example: '03:00:10' or '14:14:30'
   * Another usage is like a parser to parse seconds in a day to time string
   *
   * @param {number | undefined} secsInADay - optional
   * @returns {string}
   */

  getTimeStr (secsInADay = undefined) {
    /**
     * padding number. for example from "3" to "03", keep "43" as "43"
     *
     * @param {number}
     * @returns {string}
     */
    function padLeft (number) {
      const str = '' + number;
      const pad = '00';
      return pad.substring(0, pad.length - str.length) + str;
    }

    if (secsInADay >= SECONDS_PER_DAY) {
      secsInADay = secsInADay % SECONDS_PER_DAY;
    }
    const timeOfSecsInADay = (secsInADay == undefined ? this.timeOfSecsInADay : secsInADay);

    const secs = timeOfSecsInADay % SECONDS_PER_MINUTE;
    const mins = (timeOfSecsInADay - secs) % (SECONDS_PER_MINUTE * MINUTE_PER_HOUR) / SECONDS_PER_MINUTE;
    const hours = (timeOfSecsInADay - secs - mins * SECONDS_PER_MINUTE) / SECONDS_PER_MINUTE / MINUTE_PER_HOUR;
    return `${padLeft(hours)}:${padLeft(mins)}:${padLeft(secs)}`;
  }

  /**
   * Simulate time pass some seconds
   * @param secs
   * @returns {Promise}
   */
  async wait (secs) {
    const me = this;
    return new Promise(resolve => {
      setTimeout(function task () {
        --secs;
        me.timeOfSecsInADay++;
        if (secs > 0) {
          setTimeout(task, 0);
        } else {
          resolve();
        }
      }, 0);
    });
  }

  /**
   * Mock setTimeout on the top of this timer
   * @param {Function} fn - callback function
   * @param {number } milliSecs - milli seconds
   */
  setTimeout (fn, milliSecs) {
    const secs = Math.round(milliSecs / MILLS_PER_SECOND);
    this.wait(secs).then(function () {
      setTimeout(fn, 0);
    });
  }
}

export default Timer;