var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('admin/index', { layout: 'admin' });
});


router.get('/index', (req, res) => {
    res.render('admin/index', { layout: 'admin' });
});


router.get('/404', (req, res, next) => {
    res.render('admin/404', { layout: 'admin' });
});

router.get('/register', (req, res, next) => {
    res.render('register', { title: 'Sign up' });
})
module.exports = router;
