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

    this.objects = [
      [
        {
          x: 300,
          y: 200
        },
        {
          x: 300,
          y: 200
        }
      ],[
        {
          x: 350,
          y: 100
        },
        {
          x: 350,
          y: 500
        }
      ],[
        {
          x: 500,
          y: 350
        },{
          x: 500,
          y: 760
        }
      ]
    ]

    window.requestAnimationFrame(this.animate.bind(this));
  }

  mouseClick(e) {
    this.click = {
      x: e.offsetX,
      y: e.offsetY
    }
    // console.log(this.click);
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

    window.requestAnimationFrame(this.animate.bind(this));
  }
}

window.onload = function (){
  new App();
}