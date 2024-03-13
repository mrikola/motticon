export const makeArray = (x, y, z) => {
  let top = [];

  for (let i = 0; i < x; i++) {
    let mid = [];
    for (let j = 0; j < y; j++) {
      mid.push(new Array(z));
    }
    top.push(mid);
  }

  return top;
};
