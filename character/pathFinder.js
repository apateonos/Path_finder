export default function pathFinder (self, destination, objects) {
  let result;
  let temp = {x: self.x, y: self.y}; 
  if (findCollision(self, destination, objects)){
    result = findNewPath([[temp]], destination, objects, 0);
  } else {
    return [destination];
  }
  return result;
};

function copy (target) {
  return JSON.parse(JSON.stringify(target));
}

function findNewPath (self, destination, objects, count) {
  if( count >= 10 ) {
    return self;
  } else (
    count += 1
  );
  console.log(count);
  //console.log('self',self);
  let result = [];
  for(let i in self){
    const nPath = self[i][self[i].length - 1];

    const cp = findCollision(nPath, destination, objects);
    //console.log("cp",cp);
    if ( cp ) {
      //console.log(self[i])
      let cp1 = copy(self[i]);
      let cp2 = copy(self[i]);
      cp1.push(cp[0]);
      cp2.push(cp[1]);
      //console.log(cp1, cp2);
      if(nPath.x !== cp[0].x && nPath.y !== cp[0].y){
        result.push(cp1);
      }
      if(nPath.x !== cp[1].x && nPath.y !== cp[1].y){
        result.push(cp2);
      }
    } else {
      result.push(self[i]);
    }
  }
  console.log(result);  
  if (result.length !== self.length) {
    result = findNewPath(result, destination, objects, count);
  }

  return result;
}

function calcDistance (x1, x2, y1, y2) {
  return Math.sqrt(Math.pow(x1 - x2,2)+ Math.pow(y1 - y2, 2),2);
}

function calcCollision (x1, x2, x3, x4, y1, y2 ,y3 ,y4) {
  //console.log(x1, x2, x3, x4, y1, y2 ,y3 ,y4)
  const rX = ((x1*y2 - y1*x2)*(x3 - x4) - (x1 - x2)*(x3*y4 - y3*x4))/((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));
  const rY = ((x1*y2 - y1*x2)*(y3 - y4) - (y1 - y2)*(x3*y4 - y3*x4))/((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));      
  //console.log(rX, rY);
  //console.log(Math.min(x1, x2).toFixed(6)<= rX.toFixed(6) , rX.toFixed(6) <= Math.max(x1, x2).toFixed(6) , Math.min(y1, y2).toFixed(6)<= rY.toFixed(6) , rY.toFixed(6) <= Math.max(y1, y2).toFixed(6), Math.min(x3, x4).toFixed(6)<= rX.toFixed(6) , rX.toFixed(6) <= Math.max(x3, x4).toFixed(6) , Math.min(y3, y4).toFixed(6)<= rY.toFixed(6) , rY.toFixed(6) <= Math.max(y3, y4).toFixed(6))
  const result = {
    x: rX,
    y: rY
  }

  if(
    !isNaN(rX) && !isNaN(rY) 
    && Math.min(x1, x2)<= rX && rX <= Math.max(x1, x2) 
    && Math.min(y1, y2)<= rY && rY <= Math.max(y1, y2)
    && Math.min(x3, x4)<= rX && rX <= Math.max(x3, x4) 
    && Math.min(y3, y4)<= rY && rY <= Math.max(y3, y4)
  ){
    let result = {x: rX, y: rY};
    return result;
  }
  return false;
}

function findCollision (self, destination, objects) {
  //console.log(self, destination, objects);
  let result = false;
  let firstCollisionDistance = calcDistance(self.x, destination.x, self.y, destination.y);
  let collisionPath;

  const x1 = self.x;
  const y1 = self.y;
  const x2 = destination.x;
  const y2 = destination.y;
  //console.log(x1, y1, x2, y2);
  
  // find all collision point;
  for (let i in objects) {
    const target = objects[i];
    //console.log(target);
    for (let j in target.angle) {
      let nNum = Number(j) + 1;
      if( nNum === target.angle.length) {
        nNum = 0;
      }

      if( j == 1 && nNum == 0){
        continue;
      }

      let x3 = target.angle[j].x;
      let x4 = target.angle[nNum].x;
      let y3 = target.angle[j].y;
      let y4 = target.angle[nNum].y;

      if(x3 === Math.max(x3, x4)){
        x3 += 1;
        x4 -= 1;
      } else {
        x3 -= 1;
        x4 += 1;
      }

      if(y3 === Math.max(y3, y4)){
        y3 += 1;
        y4 -= 1;
      } else {
        y3 -= 1;
        y4 += 1;
      }

      const rc = calcCollision (x1, x2, x3, x4, y1, y2 ,y3 ,y4);

      if (rc) {
        const distance = calcDistance(self.x, rc.x, self.y, rc.y);
        if( distance <= firstCollisionDistance) {
          firstCollisionDistance = distance;
          collisionPath = [{
            x: x3,
            y: y3
          },{
            x: x4,
            y: y4
          }];
        }
      };
    }
  }
  //console.log(collisionPath);
  if (collisionPath){
    result = collisionPath;
  }
  return result;
}