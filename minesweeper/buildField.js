module.exports = (bombs) => {
  const newField = [];

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

    for (let i = -1; i <= 1; i += 1) {
      for (let j = -1; j <= 1; j += 1) {
        const xx = x + j;
        const yy = y + i;

        if (newField[yy] !== undefined && newField[yy][xx] !== undefined && newField[yy][xx].value !== 'B') {
          newField[yy][xx].value += 1;
        }
      }
    }

    return bomb;
  });

  return newField;
};
