const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

module.exports = () => {
  const bombs = [];

  while (bombs.length < 10) {
    const coords = `${random(0, 8)}-${random(0, 8)}`;

    if (bombs.indexOf(coords) === -1) {
      bombs.push(coords);
    }
  }

  return bombs;
};
