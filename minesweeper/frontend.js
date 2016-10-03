const buildField = require('./buildField.js');
const generateBombs = require('./generateBombs.js');
const drawTable = require('./drawTable.js');

const readyStateCheckInterval = setInterval(() => {
  if (document.readyState === 'complete') {
    clearInterval(readyStateCheckInterval);
    const field = buildField(generateBombs());
    drawTable(field);
  }
}, 10);
