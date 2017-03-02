export const COLORS = {RED: 'red', GREEN: 'green', YELLOW: 'yellow'};

const DEFAULT_TRANSITION_TIME = 5000;

export default class Light {
  constructor (options = {}) {
    const {transitionTime = DEFAULT_TRANSITION_TIME, initialColor = COLORS.RED, id = ''} = options;
    this.transitionTime = transitionTime;
    this.id = id;
    this.onColorChangeCallbacksMap = new Map();

    Object.defineProperty(this, 'color', {
      get () {
        return this._color;
      },

      set (newColor) {
        if (this._color === newColor) {
          return;
        }

        this._color = newColor;

        this.onColorChangeCallbacksMap.forEach(fn => {
          fn.apply(this, [this._color]);
        });
      }
    });

    this._color = initialColor;
  }

  onColorChange (fn) {
    this.onColorChangeCallbacksMap.set(fn, fn);
    return this;
  }

  offColorChange (fn) {
    this.onColorChangeCallbacksMap.delete(fn);
    return this;
  }

  turnRed () {
    this.color = COLORS.RED;
    return this;
  }

  turnYellow () {
    this.color = COLORS.YELLOW;
    return this;
  }

  turnGreen () {
    this.color = COLORS.GREEN;
    return this;
  }
}