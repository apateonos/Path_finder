import direction from './direction.js';
import pathFinder from './pathFinder.js';

export default function Character (settings) {
  this.stageWidth = settings.stageWidth;
  this.stageHeight = settings.stageHeight;
  this.context = settings.context;
  this.life = 0;
  this.deathCount = 50;
  this.temp = [];
  this.path = [];
  this.destination = {
    x: undefined,
    y: undefined
  };

  this.settings = {
    lv: 1,
    hp: 100,
    mp: 10,
    maximumSpeed: 4,
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

Character.prototype.move = function (isClicked, objects) {
  const self = this.settings;
  if ( this.destination.x === undefined || this.destination.y === undefined || this.destination.x !== isClicked.x || this.destination.y !== isClicked.y ){
    //console.log('path make!!');
    this.destination.x = isClicked.x;
    this.destination.y = isClicked.y;

    this.path = [{
      x: this.destination.x,
      y: this.destination.y
    }]
    pathFinder(self, this.destination, objects);
  }

  let waypoint = this.path[0];
  //console.log(waypoint.x, self.x);
  const distance = Math.sqrt(Math.pow(self.x - waypoint.x,2) + Math.pow(self.y - waypoint.y,2),2);
  //console.log(distance);
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

  if( distance <= self.speed){
    this.path.splice(0,1);
  }
}

Character.prototype.action = function (isClicked, isMouse, objects) {
  // live
  const self = this.settings;
  if( this.life <= 0 ){
    if( this.deathCount !== 0 ){
      this.deathCount -= 1;
    }else{
      this.settings.x = this.stageWidth*Math.random();
      this.settings.y = this.stageHeight*Math.random();
      this.life += 1;
      this.deathCount = 1000;
    }
  } 
  
  else {
    const ctx = this.context;
    //all move route

    if(isClicked && (isClicked.x !== self.x || isClicked.y !== self.y)){
      this.move(isClicked, objects);

      ctx.beginPath();
      const t1 = direction(self, isClicked, 40, 1);
      const t2 = direction(self, isClicked, 19, 1.15);
      const t3 = direction(self, isClicked, 19, -1.15);

      ctx.moveTo(t1.x+self.x, t1.y+self.y);
      ctx.lineTo(t2.x+self.x, t2.y+self.y);
      ctx.lineTo(t3.x+self.x, t3.y+self.y);

      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.closePath();
    }
    
    if(this.path.length > 0){
      ctx.beginPath();
      ctx.moveTo(self.x, self.y);
      for (let i in this.path) {
        const x = this.path[i].x;
        const y = this.path[i].y;

        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'red';
      ctx.stroke();
      ctx.closePath();

      if(this.temp.length > 0){
        ctx.beginPath();
        for (let i in this.temp) {
          const m = this.temp[i];
          if ( i == 0 ) {
            ctx.moveTo(m.x, m.y);
          } else {
            ctx.lineTo(m.x, m.y);
          }
        }
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgb(0, 0, 255, 0.3)';
        ctx.stroke();
        ctx.closePath();
      }

      ctx.beginPath();
      const t1 = direction(self, this.path[0], 35, 1);
      const t2 = direction(self, this.path[0], 19, 1.13);
      const t3 = direction(self, this.path[0], 19, -1.13);

      ctx.moveTo(t1.x+self.x, t1.y+self.y);
      ctx.lineTo(t2.x+self.x, t2.y+self.y);
      ctx.lineTo(t3.x+self.x, t3.y+self.y);

      ctx.fillStyle = 'blue';
      ctx.fill();
      ctx.closePath();
    }

    if(isMouse){
      ctx.beginPath();
      const t1 = direction(self, isMouse, 30, 1);
      const t2 = direction(self, isMouse, 19, 1.12);
      const t3 = direction(self, isMouse, 19, -1.12);

      ctx.moveTo(t1.x+self.x, t1.y+self.y);
      ctx.lineTo(t2.x+self.x, t2.y+self.y);
      ctx.lineTo(t3.x+self.x, t3.y+self.y);

      ctx.fillStyle = 'yellow';
      ctx.fill();
      ctx.closePath();
    }
    
    ctx.beginPath();
    ctx.moveTo(self.x, self.y);
    ctx.arc(self.x, self.y, 15, 0, 2*Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
  }

  // dead
  if(this.settings.hp <= 0){
    this.life -= 1;
  }
}
