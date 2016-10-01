module.exports = function(field) {
  var lost = false;
  var won = false;
  var tilesLeft = 71;

  field.map(function(row) {
    row.map(function(tile) {
      if (tile['state'] === 'shown' && tile['value'] === 'B') {
        lost = true;
      } else if (tile['state'] === 'shown') {
        tilesLeft -= 1;
      }
    });
  });

  if (tilesLeft <= 0) {
    won = true;
  }

  return {
    lost,
    won,
  }
};
