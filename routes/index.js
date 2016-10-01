var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var sqlite3 = require('sqlite3').verbose();
var minesweeper = require('../minesweeper');

var db = new sqlite3.Database('sweeper.db');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.cookies.user === undefined) {
    var user = uuid.v4();
    res.cookie('user', user, { expires: new Date(Date.now() + (24 * (60 * (60 * 1000)))) });
  } else {
    var user = req.cookies.user;
  }

  db.get('SELECT * FROM saves WHERE userid=?', user, function(err, row) {
    if (err) {
      res.render('error', { message: 'Database connection failed' });
    } else {
      if (row === undefined) {
        var field = minesweeper.buildField(minesweeper.generateBombs());
        db.run('INSERT INTO saves (userid, field) VALUES (?, ?)', user, JSON.stringify(field));
      } else {
        var field = JSON.parse(row.field);
      }

      var gameStatus = minesweeper.checkStatus(field);
      var message = null;

      if (gameStatus.lost) {
        db.run('DELETE FROM saves WHERE userid=?', user);
        message = 'You\'ve lost :(';
      } else if (gameStatus.won) {
        db.run('DELETE FROM saves WHERE userid=?', user);
        message = 'You\'ve won!';
      }

      res.render('index', { field, message });
    }
  });
});

router.get('/new', function(req, res, next) {
  if (req.cookies.user === undefined) {
    var user = uuid.v4();
    res.cookie('user', user, { expires: new Date(Date.now() + (24 * (60 * (60 * 1000)))) });
  } else {
    var user = req.cookies.user;
  }

  db.get('SELECT * FROM saves WHERE userid=?', user, function(err, row) {
    if (err) {
      res.render('error', { message: 'Database connection failed' });
    } else {
      if (row === undefined) {
        res.redirect('/');
      } else {
        db.run('DELETE FROM saves WHERE userid=?', user, function(deleteErr) {
          if (deleteErr) {
            res.render('error', { message: 'Unable to delete your save' });
          } else {
            res.redirect('/');
          }
        });
      }
    }
  });
});

router.get('/:coords', function(req, res, next) {
  var coords = req.params.coords;
  var x = Number(coords[0]);
  var y = Number(coords[2]);

  if (req.cookies.user === undefined) {
    var user = uuid.v4();
    res.cookie('user', user, { expires: new Date(Date.now() + (24 * (60 * (60 * 1000)))) });
  } else {
    var user = req.cookies.user;
  }

  db.get('SELECT * FROM saves WHERE userid=?', user, function(err, row) {
    if (err) {
      res.render('error', { message: 'Database connection failed' });
    } else {
      if (row === undefined) {
        res.redirect('/');
      } else {
        var field = JSON.parse(row.field);
        field = minesweeper.revealTile(field, x, y);

        db.run('UPDATE saves SET field=? WHERE userid=?', JSON.stringify(field), user, function(err) {
          if (err) {
            res.render('error', { message: 'Database update failed' });
          } else {
            res.redirect('/');
          }
        });
      }
    }
  });  
});

module.exports = router;
