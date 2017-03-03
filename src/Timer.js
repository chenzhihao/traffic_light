const SECONDS_PER_MINUTE = 60;
const MINUTE_PER_HOUR = 60;
const MILLS_PER_SECOND = 1000;
const HOURS_PER_DAY = 24;

class Timer {
  constructor (options) {
    const {initialTime = '00:00:00', endTime = Infinity} = options;

    if (!/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(initialTime)) {
      throw new Error('Time format should be HH:MM:SS, from 00:00:00 to 23:59:59');
    }

    this.initialTime = initialTime;

    const {hours, mins, secs} = this._parseTimeStringToObject(this.initialTime);

    this.timeOfSecsInADay = secs + mins * SECONDS_PER_MINUTE + hours * SECONDS_PER_MINUTE * MINUTE_PER_HOUR;

    this.endTime = endTime;
  }

  _parseTimeStringToObject (timeStr) {
    const timeArr = timeStr.split(':').map(item => parseInt(item));
    const hours = timeArr[0];
    const mins = timeArr[1];
    const secs = timeArr[2];
    return {hours, mins, secs};
  }

  nextTickSec () {
    if (this.timeOfSecsInADay === SECONDS_PER_MINUTE * MINUTE_PER_HOUR * HOURS_PER_DAY - 1) {
      // simple skip to a new day
      this.timeOfSecsInADay = 0;
      return;
    }
    this.timeOfSecsInADay++;
  }

  getTimeInSec () {
    return this.timeOfSecsInADay;
  }

  /**
   * Get current time in str, the format should be "HH:MM:SS"
   * for example: '03:00:10' or '14:14:30'
   * @returns {string}
   */
  getTimeStr () {
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

    const secs = this.timeOfSecsInADay % SECONDS_PER_MINUTE;
    const mins = (this.timeOfSecsInADay - secs) % (SECONDS_PER_MINUTE * MINUTE_PER_HOUR) / SECONDS_PER_MINUTE;
    const hours = (this.timeOfSecsInADay - secs - mins * SECONDS_PER_MINUTE) / SECONDS_PER_MINUTE / MINUTE_PER_HOUR;
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