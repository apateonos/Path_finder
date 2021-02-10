import direction from './direction.js';
import pathFinder from './pathfinder.js';

export default function Character (settings) {
  this.stageWidth = settings.stageWidth;
  this.stageHeight = settings.stageHeight;
  this.context = settings.context;
  this.life = 0;
  this.goal = {
    x: undefined,
    y: undefined
  }
  this.deathCount = 50;
  this.path = [];
  this.settings = {
    lv: 1,
    hp: 100,
    mp: 10,
    maximumSpeed: 5,
    speed: 0,
    mass: 30,
    attackSpeed: 10,
    ability: {
      ad: 10, // Attack Damage
      ap: 12, // Ability Point
      dp: 5, // Depanse Point
      rp: 4, // Resistance Point
    }
  }
}

console.log(Character.prototype);

Character.prototype.input = function (){

}

Character.prototype.response = function (settings) {

}

Character.prototype.move = function (isClicked, objects) {
  const self = this.settings;
  const fx = isClicked.x;
  const fy = isClicked.y;

  if( JSON.stringify(this.goal) !== JSON.stringify(isClicked) ){
    this.goal = isClicked;
    
    this.path = [];
    pathFinder(self, this.goal, objects);
/*     for (let i = 0; i < 1; i++) {
      this.path.push({
        x: Math.random()*this.stageWidth,
        y: Math.random()*this.stageHeight
      })
    } */
    const goal = {x: fx, y: fy};
    this.path.push(goal);
  }

  var waypoint = this.path[0];
  const distance = Math.sqrt(Math.pow(self.x - waypoint.x, 2) + Math.pow(self.y - waypoint.y, 2), 2);

  if( distance === 0 && this.path.length !== 1){
    this.path.splice(0,1);
  }

  if( self.speed <= distance ) {
    const dir = direction(self, waypoint, self.speed);
    self.x += dir.x;
    self.y += dir.y;
    if (self.speed < self.maximumSpeed){
      self.speed += 0.1;
    }
  } else {
    self.x = waypoint.x;
    self.y = waypoint.y;
    if(self.speed > 0){
      self.speed -= 0.1;
    }
  }
}

Character.prototype.action = function (isClicked, objects) {
  // live
  const self = this.settings;
  
  if( this.life <= 0 ){
    if( this.deathCount !== 0 ){
      this.deathCount -= 1;
    }else{
      this.settings.x = this.stageWidth*Math.random();
      this.settings.y = this.stageHeight*Math.random();
      this.goal.x = 600;
      this.goal.y = 600;
      this.life += 1;
    }
  } 
  
  else {
    this.move(isClicked, objects);

    const ctx = this.context;
    //move line
    ctx.beginPath();
    ctx.moveTo(self.x, self.y);
    ctx.lineTo(isClicked.x, isClicked.y);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = 'rgb(255, 0, 0, 0.7)';

    //character
    const t1 = direction(self, isClicked, 30, 1);
    const t2 = direction(self, isClicked, 19, 1.12);
    const t3 = direction(self, isClicked, 19, -1.12);

    ctx.moveTo(t1.x+self.x, t1.y+self.y);
    ctx.lineTo(t2.x+self.x, t2.y+self.y);
    ctx.lineTo(t3.x+self.x, t3.y+self.y);
    
    ctx.moveTo(self.x, self.y);
    ctx.arc(self.x, self.y, 15, 0, 2*Math.PI, false);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.closePath();
  }

  // dead
  if(this.settings.hp <= 0){
    this.life -= 1;
  }
}