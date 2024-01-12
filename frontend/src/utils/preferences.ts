export const generatePriorityArray = (size: number): number[] => {
  if (size < 1) return [];
  const result = [1];
  [...Array(size - 1)].reduce((acc, _curVal, curIdx) => {
    const value = acc + Math.ceil((curIdx + 1) / 2);
    if (result.length < size) result.push(value);
    return value;
  }, 1);
  return result.reverse();
};
