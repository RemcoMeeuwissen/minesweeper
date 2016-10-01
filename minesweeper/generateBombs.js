var random = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = function() {
  var bombs = [];

  while (bombs.length < 10) {
    var coords = random(0, 8) + '-' + random(0, 8);

    if (bombs.indexOf(coords) === -1) {
      bombs.push(coords);
    }
  }

  return bombs;
};
