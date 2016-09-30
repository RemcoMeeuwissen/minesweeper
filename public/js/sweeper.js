var field = [];
var lost = false;
var tilesLeft = 71;

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

var createTable = function() {
  var table = document.createElement('table');

  field.map(function(row, rowIndex) {
    var tr = table.insertRow();

    row.map(function(tile, tileIndex) {
      var td = tr.insertCell();

      if (tile['state'] === 'hidden') {
        var a = document.createElement('a');
        a.innerHTML = '\u00A0';
        a.href = '/' + tileIndex + '-' + rowIndex;
        a.onclick = revealTile;
        a.setAttribute('aria-label', 'Reveal tile');

        td.appendChild(a);
        td.className = 'hidden';
      } else {
        if (tile['value'] === 0) {
          td.appendChild(document.createTextNode('\u00A0'));
        } else {
          if (tile['value'] === 'B') {
            var child = document.createElement('img');
            child.src = '/img/bomb.png';
            child.alt = 'Bomb';
          } else {
            var child = document.createTextNode(tile['value']);
          }

          td.appendChild(child);

          if (tile['value'] === 1) {
            td.className = 'number-one';
          } else if (tile['value'] === 2) {
            td.className = 'number-two';
          } else if (tile['value'] === 3) {
            td.className = 'number-three';
          } else if (tile['value'] === 4) {
            td.className = 'number-four';
          } else if (tile['value'] === 5) {
            td.className = 'number-five';
          }
        }
      }
    });
  });

  return table;
};

var drawTable = function() {
  var div = document.getElementById('field');
  var oldTable = document.getElementsByTagName('table')[0];
  div.replaceChild(createTable(field), oldTable);


  if (lost === true || tilesLeft < 1) {
    var newTable = document.getElementsByTagName('table')[0];
    var hasMessage = document.getElementsByClassName('alert')[0] !== undefined;

    if (! hasMessage) {
      if (lost) {
        var messageString = '<h1>You\'ve lost :(</h1><a href="/">click here to restart</a>'
      } else if (tilesLeft < 1) {
        var messageString = '<h1>You\'ve won!</h1><a href="/">click here to restart</a>'
      }

      var message = document.createElement('div');
      message.className = 'alert';
      message.innerHTML = messageString;
      div.insertBefore(message, newTable);
    }
  }
}

var revealTile = function(event) {
  event.preventDefault();

  var revealSurroundingTiles = function(x, y) {
    if (field[y] !== undefined && field[y][x] !== undefined && field[y][x]['state'] === 'hidden') {
      field[y][x]['state'] = 'shown';
      tilesLeft -= 1;

      if (field[y][x]['value'] === 0) {
        for (var i = -1; i <= 1; i++) {
          for (var j = -1; j <= 1; j++) {
            revealSurroundingTiles(Number(x) + j, Number(y) + i);
          }
        }
      }
    }
  };

  var href = event.currentTarget.href.slice(-3);
  var x = href[0];
  var y = href[2];

  if (field[y] !== undefined && field[y][x] !== undefined && field[y][x]['state'] === 'hidden') {
    if (field[y][x]['value'] === 0) {
      revealSurroundingTiles(x, y);
    } else if (field[y][x]['value'] === 'B') {
      field[y][x]['state'] = 'shown';
      lost = true;
    } else {
      field[y][x]['state'] = 'shown';
      tilesLeft -= 1;
    }

    drawTable();
  }
};

field = buildField(generateBombs());
drawTable(field);
