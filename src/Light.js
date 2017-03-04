import {COLORS} from './constants';

export default class Light {
  constructor (options = {}) {
    const {initialColor = COLORS.RED} = options;
    this.onColorChangeCallbacks = [];

    /*
     make 'color' observable to implement an easy pub/sub pattern here
     */
    Object.defineProperty(this, 'color', {
      get () {
        return this._color;
      },

      set (newColor) {
        if (this._color === newColor) {
          return;
        }

        this._color = newColor;

        this.onColorChangeCallbacks.forEach(fn => {
          fn.apply(this, [this._color]);
        });
      }
    });

    this._color = initialColor;
  }

  onColorChange (fn) {
    this.onColorChangeCallbacks.push(fn);
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

  turn (color) {
    let colors = [];
    for (let key in COLORS) {
      if (COLORS.hasOwnProperty(key)) {
        colors.push(COLORS[key]);
      }
    }

    if (colors.indexOf(color) < 0) {
      throw new Error('this color not existing: ' + color);
    }

    const camelCaseColor = color.charAt(0).toUpperCase() + color.substr(1);

    return this[`turn${camelCaseColor}`]();
  }
}