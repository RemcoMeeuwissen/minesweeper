const createDOMTable = require('./createDOMTable.js');
const checkStatus = require('./checkStatus');
const revealTile = require('./revealTile.js');

const drawTable = (field) => {
  const handleTileClick = clickField => ((event) => {
    event.preventDefault();

    const href = event.currentTarget.href.slice(-3);
    const x = href[0];
    const y = href[2];

    const httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', `/${x}-${y}`);
    httpRequest.send();

    if (clickField[y] !== undefined && clickField[y][x] !== undefined && clickField[y][x].state === 'hidden') {
      if (clickField[y][x].value === 0) {
        clickField = revealTile(clickField, x, y);
      } else {
        clickField[y][x].state = 'shown';
      }

      drawTable(clickField);
    }
  });

  const fieldDiv = document.getElementById('field');
  const currentTable = document.getElementsByTagName('table')[0];

  fieldDiv.replaceChild(createDOMTable(field, handleTileClick), currentTable);

  const state = checkStatus(field);

  if (state.lost || state.won) {
    const newTable = document.getElementsByTagName('table')[0];
    const hasMessage = document.getElementsByClassName('alert')[0] !== undefined;

    if (!hasMessage) {
      let message = null;

      if (state.lost) {
        message = '<h1>You\'ve lost :(</h1><a href="/new">click here to restart</a>';
      } else if (state.won) {
        message = '<h1>You\'ve won!</h1><a href="/new">click here to restart</a>';
      }

      const messageDiv = document.createElement('div');
      messageDiv.className = 'alert';
      messageDiv.innerHTML = message;
      fieldDiv.insertBefore(messageDiv, newTable);
    }
  }
};

module.exports = drawTable;
