import intersects from './intersects.js'

export default function Character (settings) {
  //this.action = new Action(settings);
  this.stageWidth = settings.stageWidth;
  this.stageHeight = settings.stageHeight;
  this.context = settings.context;
  this.goal = {
    x: undefined,
    y: undefined
  }
  this.order = {
    leftClick: false,
    rightClick: false
  }
  this.cp = {
    x: 0,
    y: 0
  }
  this.life = false;
  this.deathCount = 10;
  this.settings = {

  }
  this.cross = {
    x1:0,
    x2:0,
    x3:0,
    x4:0,
    y1:0,
    y2:0,
    y3:0,
    y4:0
  }
}

console.log(Character.prototype);

Character.prototype.input = function (){

}

Character.prototype.add = function (settings) {
  settings.hp = 100;
  settings.mp = 10;
  settings.maxSpeed = 3;
  settings.mass = 30;
  settings.attackSpeed = 10;
  settings.ability = {
    ad: 10, // Attack Damage
    ap: 12, // Ability Point
    dp: 5, // Depanse Point
    rp: 4, // Resistance Point
  }

  this.settings = Object.assign({}, settings);
}

Character.prototype.pathFinder = function (self, objects) {
  let path;
  const x1 = self.x;
  const x2 = this.goal.x;
  const y1 = self.y;
  const y2 = this.goal.y;

  for(let idx in objects){
    const target = objects[idx];
    const initX = target.x[0];
    const initY = target.y[0];

    for(let key in target.x){
      if(key < target.x.length-1){
        const num = Number(key) + 1;
        const x3 = target.x[key];
        const x4 = target.x[num];
        const y3 = target.y[key];
        const y4 = target.y[num];
        
        const rX = ((x1*y2 - y1*x2)*(x3 - x4) - (x1 - x2)*(x3*y4 - y3*x4))/((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));
        const rY = ((x1*y2 - y1*x2)*(y3 - y4) - (y1 - y2)*(x3*y4 - y3*x4))/((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));      
        
        if(
          !isNaN(rX) && !isNaN(rY) 
          && Math.min(x1, x2)<= rX && rX <= Math.max(x1, x2) 
          && Math.min(y1, y2)<= rY && rY <= Math.max(y1, y2)
          && Math.min(x3, x4)<= rX && rX <= Math.max(x3, x4) 
          && Math.min(y3, y4)<= rY && rY <= Math.max(y3, y4)
          ){
            this.cp = {
              x: rX,
              y: rY
            }
            this.cross={
              x1,x2,x3,x4,y1,y2,y3,y4
            }
            break;
        }
      } else {
        const x3 = target.x[key];
        const x4 = target.x[0];
        const y3 = target.y[key];
        const y4 = target.y[0];
        console.log(x3, x4, y3, y4)
        const rX = ((x1*y2 - y1*x2)*(x3 - x4) - (x1 - x2)*(x3*y4 - y3*x4))/((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));
        const rY = ((x1*y2 - y1*x2)*(y3 - y4) - (y1 - y2)*(x3*y4 - y3*x4))/((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));
        
        if(
          !isNaN(rX) && !isNaN(rY) 
          && Math.min(x1, x2)<= rX && rX <= Math.max(x1, x2) 
          && Math.min(y1, y2)<= rY && rY <= Math.max(y1, y2)
          && Math.min(x3, x4)<= rX && rX <= Math.max(x3, x4) 
          && Math.min(y3, y4)<= rY && rY <= Math.max(y3, y4)
          ){
            this.cp = {
              x: rX,
              y: rY
            }
            this.cross={
              x1,x2,x3,x4,y1,y2,y3,y4
            }
            break;
        }
      }
      this.cp = {
        x: 0,
        y: 0
      }
      this.cross = {
        x1:0,
        x2:0,
        x3:0,
        x4:0,
        y1:0,
        y2:0,
        y3:0,
        y4:0
      }
    }
  }
}

Character.prototype.move = function (isClick) {

}

Character.prototype.action = function (isClicked, objects) {
  const self = this.settings;
  if( !this.life ){
    if( this.deathCount !== 0 ){
      console.log('response..');
      this.deathCount -= 1;
    }else{
      console.log('alive!!');
      this.add({
        x: this.stageWidth*Math.random(),
        y: this.stageHeight*Math.random(),
        speed: 1
      })
      this.life = true;
    }
  } 
  
  else {
    if( JSON.stringify(this.goal) !== JSON.stringify(isClicked) ){
      this.goal = isClicked;
      this.pathFinder(self, objects);
    }
  
    const ctx = this.context;
    const p = this.cross;
    ctx.beginPath();
    ctx.moveTo(p.x3, p.y3);
    ctx.lineTo(p.x4, p.y4);
    ctx.linWidth = 10;
    ctx.stroke();
    ctx.strokeStyle = 'red';

    ctx.moveTo(self.x, self.y);
    ctx.lineTo(isClicked.x, isClicked.y);
    ctx.linWidth = 10;
    ctx.stroke();
    ctx.strokeStyle = 'red';
    
    ctx.moveTo(this.cp.x, this.cp.y);
    ctx.arc(this.cp.x, this.cp.y, 5, 0, 2*Math.PI, false);
    ctx.fill();


    ctx.moveTo(self.x, self.y);
    ctx.arc(self.x, self.y, 15, 0, 2*Math.PI, false);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.closePath();
  }
}