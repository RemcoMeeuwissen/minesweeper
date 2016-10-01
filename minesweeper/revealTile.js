module.exports = function(field, x, y) {
  var revealSurroundingTiles = function(x, y) {
    if (field[y] !== undefined && field[y][x] !== undefined && field[y][x]['state'] === 'hidden') {
      field[y][x]['state'] = 'shown';

      if (field[y][x]['value'] === 0) {
        for (var i = -1; i <= 1; i++) {
          for (var j = -1; j <= 1; j++) {
            revealSurroundingTiles(Number(x) + j, Number(y) + i);
          }
        }
      }
    }
  };

  if (field[y] !== undefined && field[y][x] !== undefined && field[y][x]['state'] === 'hidden') {
    if (field[y][x]['value'] === 0) {
      revealSurroundingTiles(x, y);
    } else {
      field[y][x]['state'] = 'shown';
    }
  }

  return field;
};
