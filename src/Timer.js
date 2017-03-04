import {SECONDS_PER_MINUTE, MINUTE_PER_HOUR, SECONDS_PER_DAY} from './constants';

class Timer {
  constructor (options) {
    const {initialTimeStr = '00:00:00', durationInSec = 0.5 * MINUTE_PER_HOUR * SECONDS_PER_MINUTE} = options;

    if (!/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(initialTimeStr)) {
      throw new Error('Time format should be HH:MM:SS, from 00:00:00 to 23:59:59');
    }

    if (Number.isInteger(durationInSec) || durationInSec <= 0) {
      new Error('Duration seconds must be positive integer number');
    }

    /**
     * initial time string is the input start time in string format 'HH:MM:SS'
     * Should be from '00:00:00' to '23:59:59'
     * Default is '00:00:00'
     * @type {string}
     */
    this.initialTimeStr = initialTimeStr;

    /**
     * Duration seconds. How many seconds the timer will execute.
     * Duration seconds must be positive integer number
     * Default is 1800, which is half an hour
     * @type {number}
     */
    this.durationInSec = durationInSec;

    const {hours, mins, secs} = this._parseTimeStringToObject(this.initialTimeStr);

    /**
     * How many days the timer has passed by
     * @type {number}
     */
    this.passedDays = 0;

    /**
     * The time is which second of the day(n-th seconds in a day).
     * @private
     * @type {number}
     */
    this._timeOfSecsInADay = secs + mins * SECONDS_PER_MINUTE + hours * SECONDS_PER_MINUTE * MINUTE_PER_HOUR;

    this.initialTimeOfSecsInADay = this._timeOfSecsInADay;

    // use the Proxy pattern, so we can automatically do passedDay control
    Object.defineProperty(this, 'timeOfSecsInADay', {
      get () {
        return this._timeOfSecsInADay;
      },

      set (timeOfSecsInADay) {
        if (timeOfSecsInADay >= SECONDS_PER_DAY) {
          this.passedDays += timeOfSecsInADay / SECONDS_PER_DAY;
          this._timeOfSecsInADay = timeOfSecsInADay % SECONDS_PER_DAY;
        } else {
          this._timeOfSecsInADay = timeOfSecsInADay;
        }
      }
    });

    this._laterTasks = [];
  }

  getTimeInSec () {
    return this.timeOfSecsInADay;
  }

  /**
   * How many seconds has the timer passed by(Including passed days).
   * @returns {number}
   */
  getPassedDurationInSec () {
    return this.getTimeInSec() - this.initialTimeOfSecsInADay + this.passedDays * SECONDS_PER_DAY;
  }

  /**
   * Parse Time string to object as {hours, mins, secs}
   * @param timeStr
   * @returns {{hours: number, mins: number, secs: number}}
   * @private
   */
  _parseTimeStringToObject (timeStr) {
    const timeArr = timeStr.split(':').map(item => parseInt(item));
    const hours = timeArr[0];
    const mins = timeArr[1];
    const secs = timeArr[2];
    return {hours, mins, secs};
  }

  /**
   * Get current time in str, the format should be "HH:MM:SS"
   * for example: '03:00:10' or '14:14:30'
   * Another usage is like a parser, which can parse n-th seconds in a day to time string
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
   * Start timer, the timer will execute 'nextTickSec' in async loop until duration time.
   * @returns {Promise}
   */
  async start () {
    const me = this;
    return new Promise(function (resolve) {
      function loop () {
        if (me.getPassedDurationInSec() >= me.durationInSec) {
          resolve();
          return;
        }

        me.nextTickSec();

        // Do NOT block event loop
        setImmediate(function () {
          loop();
        });
      }

      loop();
    });
  }

  /**
   * Simulate a timer tick to next second
   * Here we will check added 'onLater' tasks, run the tasks which is already on the time
   */
  nextTickSec () {
    this.timeOfSecsInADay++;

    /*
     * Here is interesting, we may run "timer.onLater" to add another callback here,
     * So we must lock current task scope, do not run the added callback.
     */
    const currentTasksCount = this._laterTasks.length;

    for (let i = 0; i < currentTasksCount; i++) {
      const taskInfo = this._laterTasks[i];
      taskInfo.secsLater -= 1;
      if (taskInfo.secsLater === 0) {
        taskInfo.task(this);
        taskInfo.executed = true;
      }
    }

    this._laterTasks = this._laterTasks.filter(taskInfo => taskInfo.executed !== true);
  }

  /**
   * Like a mocked setTimeout, will execute some task in specify seconds later
   * @param {function} fn - callback task
   * @param {number} secsLater - how many seconds later, we will run the task
   */
  onLater (fn, secsLater) {
    if (!Number.isInteger(secsLater) || secsLater < 1) {
      throw new Error('Must be positive integer seconds later!');
    }
    this._laterTasks.push({task: fn, secsLater});
  }
}

export default Timer;