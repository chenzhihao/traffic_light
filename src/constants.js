export const COLORS = {RED: 'red', GREEN: 'green', YELLOW: 'yellow'};
export const DEFAULT_TRANSITION_TIME = 30000;

export const LIGHT_DURATION = {
  RED: 5 * 60,
  GREEN: 5 * 60 - 30,
  YELLOW: 30,
};

export const LIGHT_PROTOCOL_MAPPING = [
  {color: COLORS.GREEN, duration: LIGHT_DURATION.GREEN},
  {color: COLORS.YELLOW, duration: LIGHT_DURATION.YELLOW},
  {color: COLORS.RED, duration: LIGHT_DURATION.RED}
];
