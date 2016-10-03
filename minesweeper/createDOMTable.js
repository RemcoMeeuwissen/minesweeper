module.exports = (field, handleTileClick) => {
  const table = document.createElement('table');
  const onTileClick = handleTileClick(field);

  field.map((row, rowIndex) => {
    const tr = table.insertRow();

    row.map((tile, tileIndex) => {
      const td = tr.insertCell();

      if (tile.state === 'hidden') {
        const a = document.createElement('a');
        a.innerHTML = '\u00A0';
        a.href = `/${tileIndex}-${rowIndex}`;
        a.onclick = onTileClick;
        a.setAttribute('aria-label', 'Reveal tile');

        td.appendChild(a);
        td.className = 'hidden';
      } else if (tile.value === 'B') {
        const img = document.createElement('img');
        img.src = '/img/bomb.png';
        img.alt = 'Bomb';

        td.appendChild(img);
      } else if (tile.value === 0) {
        td.appendChild(document.createTextNode('\u00A0'));
      } else {
        td.append(document.createTextNode(tile.value));

        if (tile.value === 1) {
          td.className = 'number-one';
        } else if (tile.value === 2) {
          td.className = 'number-two';
        } else if (tile.value === 3) {
          td.className = 'number-three';
        } else if (tile.value === 4) {
          td.className = 'number-four';
        } else if (tile.value === 5) {
          td.className = 'number-five';
        }
      }

      return td;
    });

    return tr;
  });

  return table;
};
