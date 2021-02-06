export default function direction (self, target, distance, degree) {
  if( degree === undefined ){
    degree = 1;
  }
  const dy = self.y - target.y;
  const dx = self.x - target.x;
  let deg = Math.atan2(dx,dy)+Math.PI/degree;
  if(deg < 0){
    deg += 2*Math.PI;
  }

  let result =  {
    x: Math.sin( deg )*distance,
    y: Math.cos( deg )*distance
  }
  return result;
}