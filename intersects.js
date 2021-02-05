
export default function intersects (p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {

  var s1_x, s1_y, s2_x, s2_y;
  s1_x = p1_x-p0_x;
  s1_y = p1_y-p0_y;
  s2_x = p3_x-p2_x;
  s2_y = p3_y-p2_y;

  var s, t;
  s = (-s1_y * (p0_x-p2_x) + s1_x * (p0_y-p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
  t = (s2_x * (p0_y-p2_y)-s2_y * (p0_x-p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

  console.log(s, t)
  if (0 <= s && s <= 1 && 0 <= t && t <= 1)
  {
    return true;
  }
  return false;
}