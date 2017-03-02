import Light from './Light';

const light = new Light();
light.onColorChange(function (color) {
  console.log(color);
  console.log(this);
});

light.turnYellow();
