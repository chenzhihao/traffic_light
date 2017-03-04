export const COLORS = {RED: 'red', GREEN: 'green', YELLOW: 'yellow'};

export const LIGHT_DURATION = {
  RED: 5 * 60,
  GREEN: 5 * 60 - 30,
  YELLOW: 30,
};

export const LIGHT_PROTOCOL_MAPPING = [
  {color: COLORS.GREEN, durationInSec: LIGHT_DURATION.GREEN},
  {color: COLORS.YELLOW, durationInSec: LIGHT_DURATION.YELLOW},
  {color: COLORS.RED, durationInSec: LIGHT_DURATION.RED}
];

export const SECONDS_PER_MINUTE = 60;
export const MINUTE_PER_HOUR = 60;
export const SECONDS_PER_DAY = 60 * 60 * 24;