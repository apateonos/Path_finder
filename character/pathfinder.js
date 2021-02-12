export default function pathFinder (self, goal, objects) {
  let path = [];
  const temp = [[{
    x: self.x,
    y: self.y
  }]];
  let paths = searchPath (temp, goal, objects);
  if(goal.x !== undefined){
    console.log('set!!!');
    paths.map((el)=> el.push({x: goal.x, y: goal.y}));
  }
  if(paths[0].length > 1){
    const idx = measureShortestPath(paths);
    return paths[idx];
  }
  return paths;
}

function measureShortestPath (paths) {
  console.log('measure');
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
// [[{},{},{}]]
function searchPath (previousPath, goal, objects) {
  let result = [];
  for (let i in previousPath) {
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
  }

  if(result.length > previousPath.length){
    console.log('re');
    let temp = copyObjJSON(result);
    result = searchPath(temp, goal, objects);
  }
  return result;
}

function copyObjJSON (target) {
  return JSON.parse(JSON.stringify(target));
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
