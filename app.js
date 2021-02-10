import Character from './character/character.js';

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

    this.object =
      [{
        x: [400+Math.random()*100, 500+Math.random()*100, 600+Math.random()*100, 550+Math.random()*100, 450+Math.random()*100],
        y: [400+Math.random()*100, 100+Math.random()*100, 400+Math.random()*100, 450+Math.random()*100, 450+Math.random()*100]
      },
      {
        x: [500+Math.random()*100, 500+Math.random()*100, 600+Math.random()*100, 550+Math.random()*100, 450+Math.random()*100],
        y: [700+Math.random()*100, 600+Math.random()*100, 700+Math.random()*100, 1000+Math.random()*100, 1000+Math.random()*100]
      }
    ]

    window.requestAnimationFrame(this.animate.bind(this));
  }

  mouseClick(e) {
    this.click = {
      x: e.offsetX,
      y: e.offsetY
    }
    console.log(this.click);
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
    
    
    for(var key in this.object){
      const self = this.object[key]
      this.context.beginPath();
      for(var idx in self.x) {
        const x = self.x[idx];
        const y = self.y[idx];
        if(idx === 0){
          this.context.moveTo(x, y);
        }
        else {
          this.context.lineTo(x, y);
        }
      }
      this.context.fill();
      this.context.fillStyle = 'red';
      this.context.closePath();
    }

    this.character.action(this.click, this.object);

    window.requestAnimationFrame(this.animate.bind(this));
  }
}

window.onload = function (){
  new App();
}