import test from 'ava';
import Light from '../src/Light';
import {COLORS} from '../src/constants';

test('Light can be initialization with color', t => {
  const light = new Light({initialColor: COLORS.RED});
  t.is(light.color, COLORS.RED);
});

test('Light can change to red, yellow, green', t => {
  const light = new Light();
  light.turnRed();
  t.is(light.color, COLORS.RED);

  light.turnGreen();
  t.is(light.color, COLORS.GREEN);

  light.turnYellow();
  t.is(light.color, COLORS.YELLOW);
});

test('Light can turn to specify color', t=> {
  const light = new Light();
  light.turn(COLORS.RED);
  t.is(light.color, COLORS.RED);

  light.turn(COLORS.GREEN);
  t.is(light.color, COLORS.GREEN);

  light.turn(COLORS.YELLOW);
  t.is(light.color, COLORS.YELLOW);
});

test.cb('Change Light color will trigger callback', t => {
  const light = new Light({initialColor: COLORS.YELLOW});

  light.onColorChange(function (color) {
    t.is(color, COLORS.RED);
    t.end();
  });

  light.turnRed();
});

test.cb('Not Change Light color will trigger callback', t => {
  const light = new Light({initialColor: COLORS.YELLOW});

  light.onColorChange(function (color) {
    t.fail('should not be triggered');
  });

  light.turnYellow();

  t.end();
});