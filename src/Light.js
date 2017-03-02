const COLORS = {RED: 'red', GREEN: 'green', YELLOW: 'yellow'};

const DEFAULT_TRANSITION_TIME = 5000;

class Light {
  constructor ({transitionTime = DEFAULT_TRANSITION_TIME, initialColor = COLORS.RED}) {
    this.transitionTime = transitionTime;
    this.color = initialColor;
  }

  turnRed () {
    this.color = COLORS.YELLOW;
    this.color = COLORS.RED;
  }

  turnGreen () {
    this.color = COLORS.GREEN;
  }
}