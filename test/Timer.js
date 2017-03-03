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

test('Timer can go to next tick', t => {
  const timer = new Timer({initialTimeStr: '00:00:00'});
  timer.nextTickSec();
  t.is(timer.getTimeStr(), '00:00:01');

  const timer2 = new Timer({initialTimeStr: '23:59:59'});
  timer2.nextTickSec();
  t.is(timer2.getTimeStr(), '00:00:00');
});

test('Timer can go to next tick which jump to next day', t => {
  const timer = new Timer({initialTimeStr: '23:59:59'});
  timer.nextTickSec();
  t.is(timer.getTimeStr(), '00:00:00');
  t.is(timer._passedDays, 1);
});

test('Timer can wait to some seconds later', async t => {
  const timer = new Timer({initialTimeStr: '00:00:00'});
  await timer.wait(365);
  t.is(timer.getTimeStr(), '00:06:05');
});

test('Timer can get passed time duration in seconds', async t => {
  const timer = new Timer({initialTimeStr: '03:43:01'});
  await timer.wait(1000);
  t.is(timer.getPassedDurationInSec(), 1000);
});

test('Timer can get passed time duration in seconds (when jump to next day)', async t => {
  const timer = new Timer({initialTimeStr: '23:59:59'});
  await timer.wait(1000);
  t.is(timer.getPassedDurationInSec(), 1000);
});

test.cb('Timer can provide the mocked setTimeout', t => {
  const timer = new Timer({initialTimeStr: '00:00:00'});
  timer.setTimeout(function () {
    t.is(timer.getTimeStr(), '00:01:10');
    t.end();
  }, 70 * 1000);
});