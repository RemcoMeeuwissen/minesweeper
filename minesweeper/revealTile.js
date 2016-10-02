module.exports = (field, x, y) => {
  const isTileHidden = (xx, yy) => (field[yy] !== undefined && field[yy][xx] !== undefined && field[yy][xx].state === 'hidden');

  const revealSurroundingTiles = function revealSurroundingTiles(xx, yy) {
    if (isTileHidden(xx, yy)) {
      field[yy][xx].state = 'shown';

      // Iterate through all the surrounding tiles and reveal them if it makes sense
      if (field[yy][xx].value === 0) {
        for (let i = -1; i <= 1; i += 1) {
          for (let j = -1; j <= 1; j += 1) {
            revealSurroundingTiles(Number(xx) + j, Number(yy) + i);
          }
        }
      }
    }
  };

  if (isTileHidden(x, y)) {
    if (field[y][x].value === 0) {
      revealSurroundingTiles(x, y);
    } else {
      field[y][x].state = 'shown';
    }
  }

  return field;
};
