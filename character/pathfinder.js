export default function pathFinder (self, goal, objects) {
  let path = [self];

  const x1 = self.x;
  const x2 = goal.x;
  const y1 = self.y;
  const y2 = goal.y;

  for(let idx in objects){
    const target = objects[idx];
    for(let key in target.x){
      if(key < (target.x.length-1)){
        const num = Number(key) + 1;
        const x3 = target.x[key];
        const x4 = target.x[num];
        const y3 = target.y[key];
        const y4 = target.y[num];

        if (collisionDetection (x1, x2, x3, x4, y1, y2 ,y3 ,y4)){
          console.log('collision');
        }
      }
      else {
        const x3 = target.x[key];
        const x4 = target.x[0];
        const y3 = target.y[key];
        const y4 = target.y[0];

        if (collisionDetection (x1, x2, x3, x4, y1, y2 ,y3 ,y4)){
          console.log('collision');
        }
      }
    }
  }
  path.push[goal];
  return path;
}

function collisionDetection (x1, x2, x3, x4, y1, y2 ,y3 ,y4) {
  const rX = ((x1*y2 - y1*x2)*(x3 - x4) - (x1 - x2)*(x3*y4 - y3*x4))/((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));
  const rY = ((x1*y2 - y1*x2)*(y3 - y4) - (y1 - y2)*(x3*y4 - y3*x4))/((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));      
        
  if(
    !isNaN(rX) && !isNaN(rY) 
    && Math.min(x1, x2)<= rX && rX <= Math.max(x1, x2) 
    && Math.min(y1, y2)<= rY && rY <= Math.max(y1, y2)
    && Math.min(x3, x4)<= rX && rX <= Math.max(x3, x4) 
    && Math.min(y3, y4)<= rY && rY <= Math.max(y3, y4)
  ){
    return true;
  }
  return false;
}