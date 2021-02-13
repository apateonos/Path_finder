export default function Object (settings) {
  this.stageWidth = settings.stageWidth;
  this.stageHeight = settings.stageHeight;
  this.context = settings.context;
  this.objects = [];
  this.settings = {
    maximum: 6,
    radius: 70

  }
}

console.log(Object.prototype);

Object.prototype.addObj = function (settings) {
  // 점을 중심으로 원형으로 점을 놓고 이어가고 싶다.
  settings.p = [];

  const pi = Math.PI * 2/settings.numOfAngle;
  for(let i = 0; i < settings.numOfAngle; i++) {
    const deg = pi * (Number(i) + 1);
    settings.p.push({
      x: settings.x + Math.cos( deg )*this.settings.radius,
      y: settings.y + Math.sin( deg )*this.settings.radius
    })
  }

  this.objects.push(settings);
}

Object.prototype.setObj = function () {
  if(this.objects.length < this.settings.maximum){
    this.addObj({
      x: Math.random() * this.stageWidth,
      y: Math.random() * this.stageHeight,
      //numOfAngle: Math.round(Math.random() * 3 + 3) // 라운드 처리를 할 필요가 있을까?
      numOfAngle: 3
    })
  }
  
  for(let i in this.objects) {
    const self = this.objects[i];
    const ctx = this.context;

    ctx.beginPath();
    for (let i in self.p){
      const x = self.p[i].x;
      const y = self.p[i].y;
      if ( i == 0 ) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.fillStyle = 'red'
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
  }
}
