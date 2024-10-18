export const getGame = () => {
  const game = {};

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
          game[`${i}${j}${k}${l}`] = 0;
        }
      }
    }
  }
  return game;
};

export const getExpandLines = () => {
  const expandLines = {};
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      expandLines[`${i}${j}`] = null;
    }
  }
  return expandLines;
};
