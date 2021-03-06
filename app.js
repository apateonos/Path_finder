import Character from './character/character.js';
import Object from './map/object.js';

class App {
  constructor(){
    console.log(this);
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    window.addEventListener('contextmenu', event => event.preventDefault());
    window.addEventListener('mousedown', this.mouseClick.bind(this), false);
    window.addEventListener('mousemove', this.mouseMove.bind(this), false);
    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    var defaultSet = {
      stageWidth: this.stageWidth,
      stageHeight: this.stageHeight,
      context: this.context,
    }
    this.character = new Character({
      ...defaultSet
    })

    this.object = new Object({
      ...defaultSet
    })
    window.requestAnimationFrame(this.animate.bind(this));
  }

  mouseClick(e) {
    this.isMouseClicked = {
      x: e.offsetX,
      y: e.offsetY
    }
  }

  mouseMove(e) {
    this.isMousePosition = {
      x: e.offsetX,
      y: e.offsetY
    }
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth;
    this.canvas.height = this.stageHeight;
  }

  animate() {
    this.context.clearRect(0,0, this.stageWidth, this.stageHeight);
    this.object.setObj();
    this.character.action(this.isMouseClicked, this.isMousePosition, this.object.objects);

    window.requestAnimationFrame(this.animate.bind(this));
  }
}

window.onload = function (){
  new App();
}