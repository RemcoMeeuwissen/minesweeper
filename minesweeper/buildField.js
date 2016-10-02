module.exports = (bombs) => {
  const newField = [];

  const isTileABomb = (field, x, y) => (field[y] !== undefined && field[y][x] !== undefined && field[y][x].value !== 'B');

  while (newField.length < 9) {
    const row = [];

    while (row.length < 9) {
      row.push({ state: 'hidden', value: 0 });
    }

    newField.push(row);
  }

  bombs.map((bomb) => {
    const x = Number(bomb[0]);
    const y = Number(bomb[2]);

    newField[y][x].value = 'B';

    // Iterate through every tile around the bomb and increase its number by one
    for (let i = -1; i <= 1; i += 1) {
      for (let j = -1; j <= 1; j += 1) {
        const xx = x + j;
        const yy = y + i;

        if (isTileABomb(newField, xx, yy)) {
          newField[yy][xx].value += 1;
        }
      }
    }

    return bomb;
  });

  return newField;
};
