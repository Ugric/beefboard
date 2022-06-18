const genRand = (len: number) => {
  return Math.random()
    .toString(36)
    .substring(2, len + 2);
};

export default genRand;