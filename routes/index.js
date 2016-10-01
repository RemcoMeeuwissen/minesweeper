const express = require('express');
const uuid = require('node-uuid');
const sqlite3 = require('sqlite3').verbose();
const minesweeper = require('../minesweeper');

const router = express.Router();
const db = new sqlite3.Database('sweeper.db');

router.get('/', (req, res) => {
  let user = '';
  if (req.cookies.user === undefined) {
    user = uuid.v4();
    res.cookie('user', user, { expires: new Date(Date.now() + (24 * (60 * (60 * 1000)))) });
  } else {
    user = req.cookies.user;
  }

  db.get('SELECT * FROM saves WHERE userid=?', user, (selectErr, row) => {
    if (selectErr) {
      res.render('error', { message: 'Database connection failed' });
    } else {
      let field = '';

      if (row === undefined) {
        field = minesweeper.buildField(minesweeper.generateBombs());
        db.run('INSERT INTO saves (userid, field) VALUES (?, ?)', user, JSON.stringify(field));
      } else {
        field = JSON.parse(row.field);
      }

      const gameStatus = minesweeper.checkStatus(field);
      let message = null;

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

router.get('/new', (req, res) => {
  let user = '';

  if (req.cookies.user === undefined) {
    user = uuid.v4();
    res.cookie('user', user, { expires: new Date(Date.now() + (24 * (60 * (60 * 1000)))) });
  } else {
    user = req.cookies.user;
  }

  db.get('SELECT * FROM saves WHERE userid=?', user, (selectErr, row) => {
    if (selectErr) {
      res.render('error', { message: 'Database connection failed' });
    } else if (row === undefined) {
      res.redirect('/');
    } else {
      db.run('DELETE FROM saves WHERE userid=?', user, (deleteErr) => {
        if (deleteErr) {
          res.render('error', { message: 'Unable to delete your save' });
        } else {
          res.redirect('/');
        }
      });
    }
  });
});

router.get('/:coords', (req, res) => {
  const coords = req.params.coords;
  const x = Number(coords[0]);
  const y = Number(coords[2]);
  let user = '';

  if (req.cookies.user === undefined) {
    user = uuid.v4();
    res.cookie('user', user, { expires: new Date(Date.now() + (24 * (60 * (60 * 1000)))) });
  } else {
    user = req.cookies.user;
  }

  db.get('SELECT * FROM saves WHERE userid=?', user, (selectErr, row) => {
    if (selectErr) {
      res.render('error', { message: 'Database connection failed' });
    } else if (row === undefined) {
      res.redirect('/');
    } else {
      let field = JSON.parse(row.field);
      field = minesweeper.revealTile(field, x, y);

      db.run('UPDATE saves SET field=? WHERE userid=?', JSON.stringify(field), user, (updateErr) => {
        if (updateErr) {
          res.render('error', { message: 'Database update failed' });
        } else {
          res.redirect('/');
        }
      });
    }
  });
});

module.exports = router;
