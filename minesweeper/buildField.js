module.exports = function(bombs) {
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
