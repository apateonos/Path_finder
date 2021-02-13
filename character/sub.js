export default function pathFinder (self, destination, objects) {
  let paths = [[self]];
  if (objects){
    paths = findPaths(paths, destination, objects);
  }
  paths.map(el => el.push({x: destination.x, y: destination.y})); // add destination path
  let result = calcShortestPath(paths); // find shortest path
  //result = optimizePath(result, objects);
  return result;
}

function optimizePath (path, objects) {
  let result = path;
  console.log('b',result)
  let toggle = true;
  if ( path === undefined || path.length <= 2){ // Straight is already optimized
    return path;
  }

  for (let i in path) {
    let nNum = Number(i) + 2;
    if( !findCollision(path[i], path[nNum], objects) && toggle ) {
      toggle = false;
      result.splice(Number(i) + 1,1);
    } else {
      toggle = true;
    }

    if(nNum === path.length - 1){
      console.log('a',result);
      return result;
    }
  }
}

// [[{},{},{}]]
function findPaths (previousPath, destination, objects) {
  //console.log('previousPath', previousPath);
  let result = [];
  for (let i in previousPath) {
    const self = previousPath[i][previousPath[i].length - 1];
    const res = findCollision(self, destination, objects);
    console.log(res);
    if ( res ) {

    }
  }
  
  //console.log(result);
  if(result.length !== previousPath.length){ //check result add path
    //console.log('more want findPath!!');
    //console.log('before',result);
    result = findPaths(result, destination, objects);
    //console.log('after',result);
  }
  return result;
}

function findCollision (self, destination, objects) {
  //console.log("self",self);
  const x1 = self.x;
  const y1 = self.y;
  const x2 = destination.x;
  const y2 = destination.y;
  
  let shortestCollisionDistance = calcDistance(x1, x2, y1, y2);
  let result = false;
  //console.log('want to go path', x1, x2, y1, y2);
  for(let j in objects){
    const obj = objects[j].p;
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
      //console.log('x3', x3,'y3', y3,'x4', x4,'y4', y4);
      const checkCollision = calcCollision (x1, x2, x3, x4, y1, y2 ,y3 ,y4);
      //console.log ('check collision',checkCollision);

      if (checkCollision && checkCollision.x !== x1 && checkCollision.y !== y1) {
        const distance = calcDistance(x1, checkCollision.x, y1, checkCollision.y);
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

function calcDistance (x1, x2, y1, y2) {
  return Math.sqrt(Math.pow(x1 - x2,2)+ Math.pow(y1 - y2, 2),2);
}



function calcCollision (x1, x2, x3, x4, y1, y2 ,y3 ,y4) {
  const rX = ((x1*y2 - y1*x2)*(x3 - x4) - (x1 - x2)*(x3*y4 - y3*x4))/((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));
  const rY = ((x1*y2 - y1*x2)*(y3 - y4) - (y1 - y2)*(x3*y4 - y3*x4))/((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));      
  
  if(
    !isNaN(rX) && !isNaN(rY) 
    && Math.min(x1, x2).toFixed(6)<= rX.toFixed(6) && rX.toFixed(6) <= Math.max(x1, x2).toFixed(6) 
    && Math.min(y1, y2).toFixed(6)<= rY.toFixed(6) && rY.toFixed(6) <= Math.max(y1, y2).toFixed(6)
    && Math.min(x3, x4).toFixed(6)<= rX.toFixed(6) && rX.toFixed(6) <= Math.max(x3, x4).toFixed(6) 
    && Math.min(y3, y4).toFixed(6)<= rY.toFixed(6) && rY.toFixed(6) <= Math.max(y3, y4).toFixed(6)
  ){
    let result = {x: rX, y: rY};
    return result;
  }
  return false;
}



function calcShortestPath (paths) {
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

  const shortestPathDistance = Math.min.apply(null , temp);
  return paths[temp.indexOf(shortestPathDistance)];
}