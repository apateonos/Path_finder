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
          x: 500,
          y: 200
        },
        {
          x: 600,
          y: 700
        }
      ],[
        {
          x: 400,
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
        },
        {
          x: 500,
          y: 760
        }
      ],[
        {
          x: 550,
          y: 150
        },
        {
          x: 700,
          y: 360
        }
      ],[
        {
          x: 700,
          y: 220
        },
        {
          x: 680,
          y: 170
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

    for(let i in this.objects){
      const s = this.objects[i];
      for(let j in s){
        const m = s[j];
        if (j == 0){
          this.context.beginPath();
          this.context.moveTo(m.x, m.y);
        }else {
          this.context.lineTo(m.x, m.y);

          if( j == s.length - 1){
            this.context.stroke();
            this.context.lineWidth = 2;
            this.context.closePath();
          }
        }
      }
    }
    window.requestAnimationFrame(this.animate.bind(this));
  }
}

window.onload = function (){
  new App();
}