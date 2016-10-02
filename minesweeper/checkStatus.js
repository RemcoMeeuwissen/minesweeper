module.exports = (field) => {
  let lost = false;
  let won = false;
  // There are 71 non-bomb tiles, if all of them are uncovered the player has won
  let tilesLeft = 71;

  field.map((row) => {
    row.map((tile) => {
      if (tile.state === 'shown' && tile.value === 'B') {
        lost = true;
      } else if (tile.state === 'shown') {
        tilesLeft -= 1;
      }

      return tile;
    });

    return row;
  });

  if (tilesLeft <= 0 && !lost) {
    won = true;
  }

  return {
    lost,
    won,
  };
};
