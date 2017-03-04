import test from 'ava';
import Timer from '../src/Timer';

test('Timer will throw error when the input format not correct', t => {
  const error = t.throws(() => {
    new Timer({initialTimeStr: '24:00:00'});
  });

  t.is(error.message, 'Time format should be HH:MM:SS, from 00:00:00 to 23:59:59');
});

test('Timer can parse time to {hours, mins, secs}', t => {
  const timer = new Timer({initialTimeStr: '00:00:10'});

  t.deepEqual(timer._parseTimeStringToObject(timer.initialTimeStr), {hours: 0, mins: 0, secs: 10});
});

test('Timer can get time as secs in a day', t => {
  const timer = new Timer({initialTimeStr: '13:43:10'});
  t.is(timer.getTimeInSec(), 10 + 43 * 60 + 60 * 60 * 13);
});

test('Timer can get time as string', t => {
  const timer = new Timer({initialTimeStr: '03:43:01'});
  t.is(timer.getTimeStr(), '03:43:01');
});

test('Timer can start, it will stop after durationInSec', async t => {
  const timer = new Timer({initialTimeStr: '00:00:00', durationInSec: 10});
  await timer.start();
  t.is(timer.getTimeStr(), '00:00:10');
});

test('Timer can start with the durationInSec which jump to next day', async t => {
  const timer = new Timer({initialTimeStr: '23:59:59', durationInSec: 10});
  await timer.start();
  t.is(timer.getTimeStr(), '00:00:09');
  t.is(timer.passedDays, 1);
});

test.cb('Timer can execute callback fn at specify later secs', t => {
  const timer = new Timer({initialTimeStr: '00:00:00', durationInSec: 1000});

  timer.onLater(function (timer) {
    t.is(timer.getPassedDurationInSec(), 10);
    t.is(timer.getTimeStr(), '00:00:10');
    timer.onLater(function (timer) {
      t.is(timer.getPassedDurationInSec(), 11);
      t.is(timer.getTimeStr(), '00:00:11');
      t.end();
    }, 1);
  }, 10);


  timer.start();
});

test.cb('Timer can execute callback fn at specify later secs (which jump to next day)', t => {
  const timer = new Timer({initialTimeStr: '23:59:59', durationInSec: 1000});

  timer.onLater(function (timer) {
    t.is(timer.getPassedDurationInSec(), 1);
    t.is(timer.getTimeStr(), '00:00:00');
    t.end();
  }, 1);

  timer.start();
});

