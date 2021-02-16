export default function pathFinder (self, destination, objects) {
  let result = {
    paths: [{o: undefined, w: [{x: self.x, y: self.y}]}]
  };
  if (findCollision(self, destination, objects)){
    result = makePath(result, destination, objects, 0);
  }

  for (let i in result.paths) {
    //console.log(result.paths[i].w[result.paths[i].length - 1]);
    if(result.paths[i].w[result.paths[i].w.length - 1]){
      result.paths[i].w.push({x: destination.x,y: destination.y});
    }
    else{
      result.paths[i].w.pop();
    }
  }
  optimizePath(result.paths, objects);

  result.shortestPath = selectShortestPath(result.paths);
  console.log(result);
  //optimizePath(result, objects);
  
  //console.log(result);

  return result;
};

function optimizePath (paths, objects) {
  let result = [];
  for (let i in paths) {
    const p = paths[i].w;
     
  }
}

function selectShortestPath (paths) { 
  let distances = [];
  for (let i in paths) {
    const p = paths[i].w;
    if ( p.length === 2 ) {
      return p;
    }
    let distance = 0;
    for (let j = 0; j < p.length - 2; j++) {
      distance += calcDistance(p[j].x, p[j].y, p[Number(j)+1].x, p[Number(j)+1].y);
    }
    distances.push(distance);
  }
  //console.log(distances);
  const idxShortestPath = Math.min.apply(null, distances);
  //console.log("aslmdasmd",paths[distances.indexOf(idxShortestPath)]);
  return paths[distances.indexOf(idxShortestPath)].w;
}

function copy (target) {
  //console.log(target);
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
  let result = {
    paths: []
  };

  let paths = self.paths;

  for(let i in paths){
    const self = paths[i];
    const fw = self.w[self.w.length - 1];

    //console.log('fw', fw);
    //console.log('self',self);
    const cp = findCollision(fw, destination, objects, self.o);

    //console.log("cp",cp);
    if ( cp ) {
      const newPaths = overcomeObject(cp, destination, objects);
      let temp = copy(self.w);
      //console.log(temp);
      if (newPaths) {
        let temp_ = copy(self.w);
        //console.log("newPaths",newPaths);

        for (let j in newPaths[0]) {
          temp.push(newPaths[0][j]);
        }
        
        for (let j in newPaths[1]) {
          temp_.push(newPaths[1][j]);
        }

        //console.log(temp, temp_);
        result.paths.push({o: cp.object, w: temp});
        result.paths.push({o: cp.object, w: temp_});
      }else {
        //console.log('col!')
        temp.push({x: cp.cp.x, y: cp.cp.y});
        temp.push(false);
        //console.log(temp);
        result.paths.push({o: self.o, w: temp});
        
      }
    } else {
      result.paths.push({o: self.o, w: self.w});
    }
  }
  if (result.paths.length !== paths.length) {
    result = makePath(result, destination, objects, count);
  }

  return result;
}

function overcomeObject (collision, destination, objects) {
  //console.log('objpass!');
  //console.log('충돌 패스', collision.path);
  const object = objects[collision.object];
  const n = collision.path;
  let cp1 = n;
  let cp2 = n + 1;
  
  let op1 = cp1 - 1;
  let op2 = cp2 + 1;

  let dp = destination;

  let pp1 = cp1 + 1;
  let pp2 = cp2 - 1;

  let toggle = true;
  let p1 = [];
  let p2 = [];

  let count = 0;

  while (toggle) {
    op1 = cp1 - 1;
    pp1 = cp1 + 1;
    cp1 = findAngle(cp1, object);
    op1 = findAngle(op1, object);
    pp1 = findAngle(pp1, object);
    //console.log(collision.path)
    const cp1_p = object.angle[cp1];
    const op1_p = object.angle[op1];
    const pp1_p = object.angle[pp1];

    //console.log(count);
    if(cp1 === collision.path) {
      count += 1;
    }
    if( count === 2 ){
      return false;
    }
    p1.push(cp1_p);
    //console.log(cp1, cp2, op1, op2, pp1, pp2);

    let redDeg = calcDeg(cp1_p.x, cp1_p.y, op1_p.x, op1_p.y) - calcDeg(cp1_p.x, cp1_p.y, pp1_p.x, pp1_p.y);
    if (redDeg > 0) {
      redDeg = 360 - redDeg;
    } else if ( redDeg < 0 ) {
      redDeg *= -1;
    }
    let greenDeg = calcDeg(cp1_p.x, cp1_p.y, dp.x, dp.y) - calcDeg(cp1_p.x, cp1_p.y, pp1_p.x, pp1_p.y);
    if (greenDeg > 0) {
      greenDeg = 360 - greenDeg;
    } else if (greenDeg < 0) {
      greenDeg *= -1;
    }

    if ( 0 <= greenDeg && greenDeg <= redDeg ) {
      //console.log('너는 안쪽으로 들어가고있어요!');
      //console.log('degree',greenDeg, greenDeg, redDeg)
      //console.log('cp',cp1);
      //console.log('angle',object.angle[cp1]);
      cp1 -=1;
    }else {
      toggle = false;
    }
  }

  toggle = true;
  count = 0;
  while (toggle) {
    op2 = cp2 - 1;
    pp2 = cp2 + 1;
    cp2 = findAngle(cp2, object);
    op2 = findAngle(op2, object);
    pp2 = findAngle(pp2, object);
    //console.log(collision.path)
    const cp2_p = object.angle[cp2];
    const op2_p = object.angle[op2];
    const pp2_p = object.angle[pp2];

    //console.log(count);
    if(cp2 === collision.path) {
      count += 1;
    }
    if( count === 2 ){
      return false;
    }
    p2.push(cp2_p);
    //console.log(cp2, cp2, op2, op2, pp2, pp2);

    let redDeg = calcDeg(cp2_p.x, cp2_p.y, op2_p.x, op2_p.y) - calcDeg(cp2_p.x, cp2_p.y, pp2_p.x, pp2_p.y);
    if (redDeg < 0) {
      redDeg = 360 + redDeg;
    }
    let greenDeg = calcDeg(cp2_p.x, cp2_p.y, dp.x, dp.y) - calcDeg(cp2_p.x, cp2_p.y, pp2_p.x, pp2_p.y);
    if (greenDeg < 0) {
      greenDeg = 360 + greenDeg;
    }

    if ( redDeg <= greenDeg && greenDeg <= 360 ) {
      //console.log('너는 안쪽으로 들어가고있어요!');
      //console.log('degree',greenDeg, redDeg)
      //console.log('cp',cp2);
      //console.log('angle',object.angle[cp2]);
      cp2 +=1;
    }
    else {
      //console.log('toggle');
      //console.log('degree',greenDeg, redDeg)
      //console.log('cp',cp2);
      //console.log('angle',object.angle[cp2]);
      toggle = false;
    }
  }
  //console.log(p1);

/*   if ( 0 <= greenDegree2 && greenDegree2 <= redDeg ) {
    console.log(1,'너는 안쪽으로 들어가고있어요!')
  } */
  return [p1,p2];
}


function findAngle (point, object) {
  if ( point < 0 ) {
    point = object.numOfAngle + point;
  } else if ( point >= object.numOfAngle ) {
    point = point - object.numOfAngle;
  }

  return point;
}

function calcDeg (x1, y1, x2, y2) {
  const dy = x2 - x1;
  const dx = y2 - y1;
  return Math.atan2(dy, dx)*180/Math.PI;  
}

function calcDistance (x1, x2, y1, y2) {
  return Math.sqrt(Math.pow(x1 - x2,2)+ Math.pow(y1 - y2, 2),2);
}

function calcCollision (x1, x2, x3, x4, y1, y2 ,y3 ,y4) {
  let result;
  //console.log(x1, x2, x3, x4, y1, y2 ,y3 ,y4)
  const rX = ((x1*y2 - y1*x2)*(x3 - x4) - (x1 - x2)*(x3*y4 - y3*x4))/((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));
  const rY = ((x1*y2 - y1*x2)*(y3 - y4) - (y1 - y2)*(x3*y4 - y3*x4))/((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));      
  //console.log(rX, rY);
  //console.log(Math.min(x1, x2).toFixed(6)<= rX.toFixed(6) , rX.toFixed(6) <= Math.max(x1, x2).toFixed(6) , Math.min(y1, y2).toFixed(6)<= rY.toFixed(6) , rY.toFixed(6) <= Math.max(y1, y2).toFixed(6), Math.min(x3, x4).toFixed(6)<= rX.toFixed(6) , rX.toFixed(6) <= Math.max(x3, x4).toFixed(6) , Math.min(y3, y4).toFixed(6)<= rY.toFixed(6) , rY.toFixed(6) <= Math.max(y3, y4).toFixed(6))
  result = {
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
    result = {x: rX, y: rY};
    //console.log('true');
    return result;
  }
  //console.log('false',result);
  return false;
}

function findCollision (self, destination, objects, onObject) {
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

    if ( i == onObject) {
      continue;
    }
    //console.log(target);
    for (let j in target.angle) {
      //console.log(j,'path');
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
            cp: {
              x: rc.x,
              y: rc.y
            },
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