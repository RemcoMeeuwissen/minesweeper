var random = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var generateBombs = function() {
  var bombs = [];

  while (bombs.length < 10) {
    var coords = random(0, 8) + '-' + random(0, 8);

    if (bombs.indexOf(coords) === -1) {
      bombs.push(coords);
    }
  }

  return bombs;
};

var buildField = function(bombs) {
  var newField = [];

  while (newField.length < 9) {
    var row = [];

    while (row.length < 9) {
      row.push({ state: 'hidden', value: 0 });
    }

    newField.push(row);
  }

  bombs.map(function(bomb) {
    var x = Number(bomb[0]);
    var y = Number(bomb[2]);

    newField[y][x]['value'] = 'B';

    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        var xx = x + j;
        var yy = y + i;

        if (newField[yy] !== undefined && newField[yy][xx] !== undefined && newField[yy][xx]['value'] !== 'B') {
          newField[yy][xx]['value'] += 1;
        }
      }
    }
  });

  return newField;
};

var revealTile = function(field, x, y) {
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

var checkStatus = function(field) {
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

module.exports = {
  generateBombs,
  buildField,
  revealTile,
  checkStatus,
};
