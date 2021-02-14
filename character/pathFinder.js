export default function pathFinder (self, destination, objects) {
  let result;
  let temp = {x: self.x, y: self.y}; 
  if (findCollision(self, destination, objects)){
    result = makePath([[temp]], destination, objects, 0);
  } else {
    result = [[temp]];
  }
  for (let i in result) {
    result[i].push({x: destination.x, y: destination.y});
  }
  //optimizePath(result, objects);
  result = [selectShortestPath(result)];
  //console.log(result);

  return result;
};

function optimizePath (paths, objects) {
  let result = [];
  for (let i in paths) {
    const p = paths[i];
    let pTemp = [p[0]];
    let optPath = [];
    let count = 0;
    for (let j in paths[i]) {
      pTemp.push(count);
      count ++;
    }

    for (let k in p) {
      if(pTemp.indexOf(k) === -1 ) {
        continue;
      }
      let num = Number(k);
      const standard = p[k];
      for (let l = num + 1; l< p.length; l++){
        if(!calcCollision()) {
          pTemp.push[l];
        }
      }
    }
  }
}

function selectShortestPath (paths) { 
  let distances = [];
  for (let i in paths) {
    const p = paths[i];
    if ( p.length === 2 ) {
      return p;
    }
    let distance = 0;
    for (let j = 0; j < p.length - 2; j++) {
      distance += calcDistance(p[j].x, p[j].y, p[Number(j)+1].x, p[Number(j)+1].y);
    }
    distances.push(distance);
  }

  const idxShortestPath = Math.min.apply(null, distances);
  return paths[distances.indexOf(idxShortestPath)];
}

function copy (target) {
  return JSON.parse(JSON.stringify(target));
}

function makePath (self, destination, objects, count) {
  if( count >= 15 ) {
    return self;
  } else (
    count += 1
  );
  //console.log(count);
  //console.log('self',self);
  let result = [];
  for(let i in self){
    const lastWaypoint = self[i][self[i].length - 1];
    
    const cp = findCollision(lastWaypoint, destination, objects);
    //console.log("cp",cp);
    if ( cp ) {
      const paths = overcomeObject(cp, destination, objects);
    } else {
      result.push(self[i]);
    }
  } 
  if (result.length !== self.length) {
    result = makePath(result, destination, objects, count);

  }

  return result;
}

function overcomeObject (collision, destination, objects) {
  //console.log('objpass!');
  const object = objects[collision.object];
  let cp1 = collision.path;
  let cp2 = collision.path + 1;

  let o1 = cp1 - 1;
  let o2 = cp2 + 1;

  if ( cp2 < 0 ) {
    cp2 = object.numOfAngle + cp2;
  } else if ( cp2 >= object.numOfAngle ) {
    cp2 = cp2 - object.numOfAngle;
  }

  if ( o1 < 0 ) {
    o1 = object.numOfAngle + o1;
  } else if ( o1 >= object.numOfAngle ) {
    o1 = o1 - object.numOfAngle;
  }  
  
  if ( o2 < 0 ) {
    o2 = object.numOfAngle + o2;
  } else if ( o2 >= object.numOfAngle ) {
    o2 = o2 - object.numOfAngle;
  }

  //console.log(o1, cp1, cp2, o2);
  //console.log(object.angle[o1], object.angle[cp1], object.angle[cp2], object.angle[o2]);
}

function calcDeg (x1, y1, x2, y2) {
  const dy = x1 - x2;
  const dx = y1 - y2;
  return Math.atan2(dy, dx)*180/Math.PI;  
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
  let collision;

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

      const rc = calcCollision (x1, x2, x3, x4, y1, y2 ,y3 ,y4);

      if (rc) {
        const distance = calcDistance(self.x, rc.x, self.y, rc.y);
        if( distance <= firstCollisionDistance) {
          firstCollisionDistance = distance;
          collision = {
            object: Number(i),
            path: Number(j),
            angle: [{
              x: x3,
              y: y3
            },{
              x: x4,
              y: y4
            }]
          }
        }
      };
    }
  }
  //console.log(collision);
  if (collision){
    result = collision;
  }
  return result;
}