const drawTable = require('./drawTable.js');

const readyStateCheckInterval = setInterval(() => {
  if (document.readyState === 'complete') {
    clearInterval(readyStateCheckInterval);

    /* eslint-disable no-undef */
    field = JSON.parse(field);
    drawTable(field);
    /* eslint-enable */
  }
}, 10);
