const express = require('express');
const uuid = require('node-uuid');
const sqlite3 = require('sqlite3').verbose();
const minesweeper = require('../minesweeper');

const router = express.Router();
const db = new sqlite3.Database('sweeper.db');

const getUser = (req, res) => {
  if (req.cookies.user === undefined) {
    const user = uuid.v4();
    res.cookie('user', user, { expires: new Date(Date.now() + (24 * (60 * (60 * 1000)))) });
    return user;
  }

  return req.cookies.user;
};

const getField = (saveRow, user) => {
  if (saveRow === undefined) {
    const field = minesweeper.buildField(minesweeper.generateBombs());
    db.run('INSERT INTO saves (userid, field) VALUES (?, ?)', user, JSON.stringify(field));
    return field;
  }

  return JSON.parse(saveRow.field);
};

const getMessage = (gameStatus, user) => {
  if (gameStatus.lost || gameStatus.won) {
    db.run('DELETE FROM saves WHERE userid=?', user);

    if (gameStatus.lost) {
      return 'You\'ve lost :(';
    } else if (gameStatus.won) {
      return 'You\'ve won!';
    }
  }

  return null;
};

router.get('/', (req, res) => {
  const user = getUser(req, res);

  db.get('SELECT * FROM saves WHERE userid=?', user, (selectErr, row) => {
    if (selectErr) {
      res.render('error', { message: 'Database connection failed' });
    } else {
      const field = getField(row, user);
      const html = minesweeper.createHTMLTable(field);
      const message = getMessage(minesweeper.checkStatus(field), user);

      res.render('index', { html, message });
    }
  });
});

router.get('/new', (req, res) => {
  const user = getUser(req, res);

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
  const user = getUser(req, res);

  db.get('SELECT * FROM saves WHERE userid=?', user, (selectErr, row) => {
    if (selectErr) {
      res.render('error', { message: 'Database connection failed' });
    } else if (row === undefined) {
      res.redirect('/');
    } else {
      const field = minesweeper.revealTile(getField(row, user), x, y);

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
