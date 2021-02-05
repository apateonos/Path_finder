import Character from './character.js';

class App {
  constructor(){
    console.log(this);
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    window.addEventListener('contextmenu', event => event.preventDefault());
    window.addEventListener('mousedown', this.mouseClick.bind(this), false);

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
    this.click = {
      x: undefined,
      y: undefined
    } 

    this.mouse = {
      x: undefined,
      y: undefined
    }

    this.objects = [/*{
      x: [300, 500, 500, 300],
      y: [300, 300, 500, 500]
    },
*/    {
      x: [550, 900, 800, 500],
      y: [550, 400, 700, 700]
    }]
    window.requestAnimationFrame(this.animate.bind(this));
  }

  mouseClick(e) {
    this.click = {
      x: e.offsetX,
      y: e.offsetY
    }
    if(e.button === 2){
      this.rightClick = true;
    } else {
      this.leftClick = true;
    }
  }

  mouseLocation(e) {

  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth;
    this.canvas.height = this.stageHeight;
  }

  animate() {
    this.context.clearRect(0,0, this.stageWidth, this.stageHeight);
    this.character.action(this.click, this.objects);
    
    for(var idx in this.objects){
      const self = this.objects[idx];
      this.context.beginPath();
      for(var key in self.x){
        if(key === 0){
          this.context.moveTo(self.x[key], self.y[key]);
        }
        else {
          this.context.lineTo(self.x[key], self.y[key]);
        }
      }
      this.context.fillStyle = 'rgb(255,255,255,0.7)';
      this.context.fill();
      this.context.closePath();
    }
    window.requestAnimationFrame(this.animate.bind(this));
  }
}

window.onload = function (){
  new App();
}