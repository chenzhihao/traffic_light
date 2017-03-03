import {LIGHT_PROTOCOL_MAPPING} from './constants';

const MILLI_SECONDS_PER_SECOND = 1000;

class LightController {
  constructor (options) {
    const {light, timer} = options;
    if (light == undefined || timer == undefined) {
      throw new Error('Light and Timer are required');
    }

    this.light = light;
    this.timer = timer;
  }

  getCurrentProtocol () {
    return LIGHT_PROTOCOL_MAPPING.find(item => item.color === this.light.color);
  }

  getNextProtocol () {
    const currentColor = this.getCurrentProtocol().color;
    const colors = LIGHT_PROTOCOL_MAPPING.map(item => item.color);
    const nextProtocolIndex = (colors.indexOf(currentColor) + 1 ) % LIGHT_PROTOCOL_MAPPING.length;
    return LIGHT_PROTOCOL_MAPPING[nextProtocolIndex];
  }

  begin () {
    const lightProtocol = this.getCurrentProtocol();
    const nextProtocol = this.getNextProtocol();

    this.timer.setTimeout(() => {

    }, lightProtocol.duration * MILLI_SECONDS_PER_SECOND)
  }

  async executeCurrentProtocol () {
    const currentProtocol = this.getCurrentProtocol();
    const nextProtocol = this.getNextProtocol();
    return new Promise(resolve => {
      this.timer.setTimeout(() => {
        this.light.turn(nextProtocol.color);
        resolve();
      }, currentProtocol.duration * MILLI_SECONDS_PER_SECOND);
    });
  }
}

export default LightController;