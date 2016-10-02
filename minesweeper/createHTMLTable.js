module.exports = (field) => {
  let html = '<table>';

  html = field.reduce((rowHtml, row, rowIndex) => {
    rowHtml += '<tr>';

    rowHtml = row.reduce((tileHtml, tile, tileIndex) => {
      if (tile.state === 'hidden') {
        return `${tileHtml}<td class="hidden"><a href="/${tileIndex}-${rowIndex}" aria-label="Reveal tile">&nbsp;</a></td>`;
      } else if (tile.value === 'B') {
        return `${tileHtml}<td><img src="/img/bomb.png" alt="Bomb" /></td>`;
      } else if (tile.value === 0) {
        return `${tileHtml}<td>&nbsp;</td>`;
      } else if (tile.value === 1) {
        return `${tileHtml}<td class="number-one">1</td>`;
      } else if (tile.value === 2) {
        return `${tileHtml}<td class="number-two">2</td>`;
      } else if (tile.value === 3) {
        return `${tileHtml}<td class="number-three">3</td>`;
      } else if (tile.value === 4) {
        return `${tileHtml}<td class="number-four">4</td>`;
      } else if (tile.value === 5) {
        return `${tileHtml}<td class="number-five">4</td>`;
      }

      return `${tileHtml}<td>${tile.value}</td>`;
    }, rowHtml);

    rowHtml += '</tr>';

    return rowHtml;
  }, html);

  html += '</table>';
  return html;
};
