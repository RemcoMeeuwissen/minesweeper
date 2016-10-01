module.exports = (field, x, y) => {
  const revealSurroundingTiles = function revealSurroundingTiles(xx, yy) {
    if (field[yy] !== undefined && field[yy][xx] !== undefined && field[yy][xx].state === 'hidden') {
      field[yy][xx].state = 'shown';

      if (field[yy][xx].value === 0) {
        for (let i = -1; i <= 1; i += 1) {
          for (let j = -1; j <= 1; j += 1) {
            revealSurroundingTiles(Number(xx) + j, Number(yy) + i);
          }
        }
      }
    }
  };

  if (field[y] !== undefined && field[y][x] !== undefined && field[y][x].state === 'hidden') {
    if (field[y][x].value === 0) {
      revealSurroundingTiles(x, y);
    } else {
      field[y][x].state = 'shown';
    }
  }

  return field;
};
