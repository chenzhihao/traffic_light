import test from 'ava';
import LightController from '../src/LightController';
import Light from '../src/Light';
import Timer from '../src/Timer';
import {COLORS, LIGHT_DURATION, LIGHT_PROTOCOL_MAPPING} from '../src/constants';

test('LightController can get current lightProtocol', t => {
  const light = new Light({initialColor: COLORS.GREEN});
  const timer = new Timer({initialTimeStr: '00:15:00'});
  const lightController = new LightController({light, timer});
  t.deepEqual(lightController.getCurrentProtocol(), {
    color: COLORS.GREEN,
    duration: LIGHT_DURATION.GREEN,
  });
});

test('LightController can get next lightProtocol', t => {
  const light = new Light({initialColor: COLORS.GREEN});
  const timer = new Timer({initialTimeStr: '00:15:00'});
  const lightController = new LightController({light, timer});
  t.deepEqual(lightController.getNextProtocol(), {
    color: COLORS.YELLOW,
    duration: LIGHT_DURATION.YELLOW,
  });
});

test('LightController can get next lightProtocol(loop to first protocol)', t => {
  const light = new Light({initialColor: LIGHT_PROTOCOL_MAPPING[LIGHT_PROTOCOL_MAPPING.length - 1].color});
  const timer = new Timer({initialTimeStr: '00:15:00'});
  const lightController = new LightController({light, timer});
  t.is(lightController.getNextProtocol().color, LIGHT_PROTOCOL_MAPPING[0].color);
});

test('LightController can execute lightProtocol, from yellow to red', async t => {
  const light = new Light({initialColor: COLORS.YELLOW});
  const timer = new Timer({initialTimeStr: '00:15:00'});
  const lightController = new LightController({light, timer});

  // it should be from yellow to red
  await lightController.executeCurrentProtocol();
  t.is(lightController.light.color, COLORS.RED);

  // the yellow light duration is 30s
  t.is(timer.getTimeStr(), '00:15:30');
});

test('LightController can execute lightProtocol, from red to green', async t => {
  const light = new Light({initialColor: COLORS.RED});
  const timer = new Timer({initialTimeStr: '00:00:50'});
  const lightController = new LightController({light, timer});

  // it should be from red to Green
  await lightController.executeCurrentProtocol();
  t.is(lightController.light.color, COLORS.GREEN);

  // the yellow light duration is 5 mins;
  t.is(timer.getTimeStr(), '00:05:50');
});

test('LightController can execute lightProtocol, from green to yellow', async t => {
  const light = new Light({initialColor: COLORS.GREEN});
  const timer = new Timer({initialTimeStr: '00:00:40'});
  const lightController = new LightController({light, timer});

  // it should be from yellow to red
  await lightController.executeCurrentProtocol(lightController.getNextProtocol());
  t.is(lightController.light.color, COLORS.YELLOW);

  // the green light duration is 4 mins 30 secs,
  t.is(timer.getTimeStr(), '00:05:10');
});

test('LightController can execute lightProtocol in a loop and log the light color, times', async t => {
  const light = new Light({initialColor: COLORS.GREEN});
  const timer = new Timer({initialTimeStr: '00:00:00'});
  const lightController = new LightController({light, timer, durationInSec: 60 * 20});

  // it should be from yellow to red
  await lightController.loop();

  t.deepEqual(lightController.logs, [
    {from: '00:00:00', until: '00:04:30', lightColor: COLORS.GREEN},
    {from: '00:04:30', until: '00:05:00', lightColor: COLORS.YELLOW},
    {from: '00:05:00', until: '00:10:00', lightColor: COLORS.RED},
    {from: '00:10:00', until: '00:14:30', lightColor: COLORS.GREEN},
    {from: '00:14:30', until: '00:15:00', lightColor: COLORS.YELLOW},
    {from: '00:15:00', until: '00:20:00', lightColor: COLORS.RED},
  ]);
});

test('LightController can execute lightProtocol in a loop and log the light color, times, consider the duration limitation', async t => {
  const light = new Light({initialColor: COLORS.GREEN});
  const timer = new Timer({initialTimeStr: '00:00:00'});
  const lightController = new LightController({light, timer, durationInSec: 60 * 21});

  // it should be from yellow to red
  await lightController.loop();

  t.deepEqual(lightController.logs, [
    {from: '00:00:00', until: '00:04:30', lightColor: COLORS.GREEN},
    {from: '00:04:30', until: '00:05:00', lightColor: COLORS.YELLOW},
    {from: '00:05:00', until: '00:10:00', lightColor: COLORS.RED},
    {from: '00:10:00', until: '00:14:30', lightColor: COLORS.GREEN},
    {from: '00:14:30', until: '00:15:00', lightColor: COLORS.YELLOW},
    {from: '00:15:00', until: '00:20:00', lightColor: COLORS.RED},
    {from: '00:20:00', until: '00:21:00', lightColor: COLORS.GREEN},
  ]);
});

test('LightController can execute lightProtocol in a loop and log the light color, times, consider pass a day', async t => {
  const light = new Light({initialColor: COLORS.RED});
  const timer = new Timer({initialTimeStr: '23:55:30'});
  const lightController = new LightController({light, timer, durationInSec: 60 * 21});

  // it should be from yellow to red
  await lightController.loop();

  t.deepEqual(lightController.logs, [
    {from: '23:55:30', until: '00:00:30', lightColor: COLORS.RED},
    {from: '00:00:30', until: '00:05:00', lightColor: COLORS.GREEN},
    {from: '00:05:00', until: '00:05:30', lightColor: COLORS.YELLOW},
    {from: '00:05:30', until: '00:10:30', lightColor: COLORS.RED},
    {from: '00:10:30', until: '00:15:00', lightColor: COLORS.GREEN},
    {from: '00:15:00', until: '00:15:30', lightColor: COLORS.YELLOW},
    {from: '00:15:30', until: '00:16:30', lightColor: COLORS.RED},
  ]);
});
