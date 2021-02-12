export default function pathFinder (self, goal, objects) {
  const startPath = [[self]];
  const paths = searchPaths(startPath, goal, objects);
  const result = measureShortestPath(paths);
  return result;
}


// [[{},{},{}]]
function searchPaths (previousPath, goal, objects) {
  //console.log('previousPath', previousPath);
  for (let i in previousPath) {
    const self = previousPath[i][previousPath[i].length - 1];
    const res = searchCollision(self, goal, objects);
    //console.log(res);
    if ( res ) {
      console.log(res);
      const p1 = searchCollision(self, res[0], objects);
      const p2 = searchCollision(self, res[1], objects);
      console.log(p1, p2);
      if ( p1 ) {
        let temp = self.push(res[0]);
        console.log('t',temp);
      }
    }
  }
}

function searchCollision (self, goal, objects) {
  //console.log("self",self);
  const x1 = self.x;
  const y1 = self.y;
  const x2 = goal.x;
  const y2 = goal.y;
  
  let shortestCollisionDistance = measureDistance(x1, x2, y1, y2);
  let result = false;
  //console.log('want to go path', x1, x2, y1, y2);
  for(let j in objects){
    const obj = objects[j];
    //console.log(obj,"object");
    for(let k in obj){
      let nNum = Number(k)+1;
      if(nNum === obj.length){
        nNum = 0;
      }
      const x3 = obj[k].x;
      const x4 = obj[nNum].x;
      const y3 = obj[k].y;
      const y4 = obj[nNum].y;
      //console.log(x3, y3, x4, y4);
      const checkCollision = detectCollision (x1, x2, x3, x4, y1, y2 ,y3 ,y4);
      if (checkCollision && checkCollision.x !== x1 && checkCollision.y !== y1) {
        const distance = measureDistance(x1, checkCollision.x, y1, checkCollision.y);
        //console.log(distance, shortestCollisionDistance);
        if(distance < shortestCollisionDistance) {
          shortestCollisionDistance = distance;
          result = [obj[k], obj[nNum]];
          //console.log('Now New Shortest collision Path!', obj[k], obj[nNum]);
        } else {
          //console.log('pass');
        }
      }
    }
  }
  
  //console.log('this is first collision Path', result);
  return result;
}

function DeepCopy (target) {
  return JSON.parse(JSON.stringify(target));
}

function measureDistance (x1, x2, y1, y2) {
  return Math.sqrt(Math.pow(x1 - x2,2)+ Math.pow(y1 - y2, 2),2);
}

function detectCollision (x1, x2, x3, x4, y1, y2 ,y3 ,y4) {
  const rX = ((x1*y2 - y1*x2)*(x3 - x4) - (x1 - x2)*(x3*y4 - y3*x4))/((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));
  const rY = ((x1*y2 - y1*x2)*(y3 - y4) - (y1 - y2)*(x3*y4 - y3*x4))/((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));      
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

function measureShortestPath (paths) {
  let temp = [];
  for (let j in paths){
    const el = paths[j];
    let distance = 0;
    for(let i in el){
      if( Number(i) == el.length - 1){
        temp.push(distance);
      } else{
        const x1 = el[i].x;
        const x2 = el[Number(i)+1].x;
        const y1 = el[i].y;
        const y2 = el[Number(i)+1].y;
        const res = Math.sqrt(Math.pow(x1 - x2,2)+ Math.pow(y1 - y2, 2),2);
        distance += res;
      }
    }
  }
  const s = Math.min.apply(null , temp);
  return temp.indexOf(s);
}
/* 
    const self = previousPath[i][previousPath[i].length - 1];
    let collisionCheck = false;
    let shortestPath = Math.sqrt(Math.pow(self.x - goal.x,2)+ Math.pow(self.y - goal.y, 2),2);
    let resultTemp = [];
    const x1 = self.x;
    const x2 = goal.x;
    const y1 = self.y;
    const y2 = goal.y;
    for (let j in objects){
      const target = objects[j];
      for (let k in target.x){
        if(k===target.x.length - 1){
          var x3 = target.x[k];
          var x4 = target.x[0];
          var y3 = target.y[k];
          var y4 = target.y[0];
        } else {
          var x3 = target.x[k];
          var x4 = target.x[Number(k)+1];
          var y3 = target.y[k];
          var y4 = target.y[Number(k)+1];
        }
        console.log(previousPath.length,'번째 선 검사', detectCollision(x1, x2, x3, x4, y1, y2 ,y3 ,y4));
        const rs = detectCollision (x1, x2, x3, x4, y1, y2 ,y3 ,y4);
        if (rs) {
          const distance = Math.sqrt(Math.pow(rs.x - x1,2)+ Math.pow(rs.y - y1, 2),2);          
          if(distance >= 2 && distance < shortestPath){
            shortestPath = distance;
            resultTemp = [];
            collisionCheck = true;
            let temp = copyObjJSON(previousPath[i]);
            temp.push({x: x3, y: y3});
            resultTemp.push(temp);
            temp = copyObjJSON(previousPath[i]);
            temp.push({x: x4, y: y4});
            resultTemp.push(temp);
          }
        }
      }
    }
    if(!collisionCheck){
      result.push(previousPath[i]);
    } else {
      result = resultTemp;
    }
    console.log('결과 갯수',result.length);
  }

  console.log(result.length, previousPath.length);
  if(result.length > previousPath.length){
    let temp = copyObjJSON(result);
    result = searchPath(temp, goal, objects);
  }
  return result; */