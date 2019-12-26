var express = require('express');

var router = express.Router();


router.get('/login', (req, res, next) => {
  res.render('login', { layout: false })
});
router.get('/register', (req, res, next) => {
  res.render('register', { layout: 'admin' })
});

module.exports = router;
