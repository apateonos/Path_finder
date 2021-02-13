export default function Object (settings) {
  this.stageWidth = settings.stageWidth;
  this.stageHeight = settings.stageHeight;
  this.context = settings.context;
  this.objects = [];
  this.settings = {
    maximum: 1,
    radius: 200,
    mass: 100
  }
}

console.log(Object.prototype);

Object.prototype.addObj = function (settings) {
  // 점을 중심으로 원형으로 점을 놓고 이어가고 싶다.
  settings.angle = [];

  const pi = Math.PI * 2/settings.numOfAngle;
  if (settings.numOfAngle > 2) {
    for(let i = 0; i < settings.numOfAngle; i++) {
      const deg = pi * (Number(i) + 1);
      settings.angle.push({
        x: settings.x + Math.cos( deg )*this.settings.radius*Math.random() + Math.cos( deg )*this.settings.mass,
        y: settings.y + Math.sin( deg )*this.settings.radius*Math.random() + Math.sin( deg )*this.settings.mass
      })
    }
  } else {
    for(let i = 0; i < settings.numOfAngle; i++) {
      const deg = Math.PI * 2 * Math.random();
      console.log(settings.x + Math.cos( deg )*this.settings.radius);
      settings.angle.push({
        x: settings.x + Math.cos( deg )*this.settings.radius*1.4,
        y: settings.y + Math.sin( deg )*this.settings.radius*1.4
      })
    }
  }

  this.objects.push(settings);
}

Object.prototype.setObj = function () {
  if(this.objects.length < this.settings.maximum){
    this.addObj({
      x: Math.random() * this.stageWidth,
      y: Math.random() * this.stageHeight,
      //numOfAngle: Math.round(Math.random() * 3 + 3) // 라운드 처리를 할 필요가 있을까?
      numOfAngle: 2 + Math.round(3*Math.random())
    })
  }
  
  for(let i in this.objects) {
    const self = this.objects[i];
    const ctx = this.context;

    ctx.beginPath();
    for (let i in self.angle){
      const x = self.angle[i].x;
      const y = self.angle[i].y;
      if ( i == 0 ) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.lineTo(self.angle[0].x, self.angle[0].y);

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'yellow';
    ctx.stroke();
    ctx.closePath();
  }
}
