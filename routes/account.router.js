var express = require('express');
var bcrypt = require('bcrypt');
var moment = require('moment');
var userModel = require('../models/user.model')
var router = express.Router();
var passport = require('passport');
var auth = require('../middeware/auth');

router.get('/login', (req, res, next) => {
  res.render('login', { layout: false })
});
router.get('/register', (req, res, next) => {
  res.render('register', { layout: 'admin' })
});


router.get('/is-available', (req, res, next) => {
  var user = req.query.username;
  userModel.singleByUserName(user).then(rows => {
    if (rows.length > 0) {
      return res.json(false);
    }

    return res.json(true);
  })
})

router.post('/register', (req, res, next) => {
  var saltRounds = 10;
  var hash = bcrypt.hashSync(req.body.password, saltRounds);
  //   var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
  var entity = {
    user_account: req.body.username,
    user_password: hash,
    user_name: req.body.name,
    user_mail: req.body.email,
    user_role: 0,
  }

  userModel.add(entity).then(id => {
    res.redirect('/account/login');
  })
});


router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      return res.render('login', {
        layout: false,
        err_message: info.message
      })
    }

    req.logIn(user, err => {
      if (err)
        return next(err);
      if (user.user_role != 0)
        return res.redirect('/admin/');
      else
        return res.redirect('/user/home');
    });
  })(req, res, next);
})


router.get('/profile/:id', auth, (req, res, next) => {

  userModel.single(req.params.id).then(rows => {
    res.render('admin/profile', { layout: 'admin', user: rows[0] });
  })
});

router.post('/profile/:id', auth, (req, res, next) => {
  var entity = {
    user_id: req.params.id,

    user_name: req.body.UserName,
    user_mail: req.body.UserMail,
    user_sex: req.body.UserSex,
    user_address: req.body.UserAddress,
    user_phone: req.body.UserPhone,
    user_dob: req.body.UserDOB,
    user_web: req.body.UserWeb,
    user_social: req.body.UserSocial,
  }

  userModel.update(entity).then(n => {
    res.redirect('/user/home'); //Pay attention /admin/./ not admin/./ to go out from this url
  }).catch(err => {
    console.log(err);
  });
});

router.post('/logout', (req, res, next) => {
  req.logOut();
  res.redirect('/account/login');
})
module.exports = router;
