var express = require('express');
var userModel = require('../../models/user.model');
const bodyParser = require('body-parser');
var router = express.Router();
var bcrypt = require('bcrypt');

router.get('/editors', (req, res) => {
    var p = userModel.allEditor();
    p.then(rows => {
        res.render('admin/vwAdmin/vwEditor/editors', { layout: 'admin', editors: rows });
    });

});

router.get('/editors/add', (req, res) => {
    var p = userModel.allEditor();
    p.then(rows => {
        res.render('admin/vwAdmin/vwEditor/add_editor', { layout: 'admin', editors: rows });
    })

});

router.post('/editors/add', (req, res) => {

    var saltRounds = 10;
  var hash = bcrypt.hashSync(req.body.UserCMND, saltRounds);
    var entity = {

        user_account: req.body.UserAccount,
        user_password: hash,
        user_name: req.body.UserName,
        user_role: req.body.UserRole,
        user_mail: req.body.UserMail,
        user_cmnd: req.body.UserCMND,
        user_sex: req.body.UserSex,
        user_address: req.body.UserAddress,
        user_phone: req.body.UserPhone

    }

    userModel.add(entity).then(id => {

        var p = userModel.allEditor();
        p.then(rows => {
            res.render('admin/vwAdmin/vwEditor/editors', { layout: 'admin', editors: rows });
        });

    }).catch(err => {
        console.log(err);
    });

});


router.get('/editors/edit/:id', (req, res) => {

    var id = req.params.id;
    if (isNaN(id)) {
        res.render('admin/404', {
            error: true
        });
    }
    userModel.single(id).then(rows => {
        if (rows.length > 0) {
            var p = userModel.allEditor();
            p.then(users => {
                res.render('admin/vwAdmin/vwEditor/edit_editor', { layout: 'admin', error: false, editors: users, curUser: rows[0] });

            })

        } else {
            res.render('admin/vwAdmin/vwEditor/editors', { layout: 'admin', error: true });
        }
    }).catch(err => {
        console.log(err);
        res.end('error occured.');
    });

});

router.post('/editors/update/:id', (req, res) => {

    
    var entity = {
        user_id: req.params.id,
        user_name: req.body.UserName,
        user_role: req.body.UserRole,
        user_mail: req.body.UserMail,
        user_cmnd: req.body.UserCMND,
        user_sex: req.body.UserSex,
        user_address: req.body.UserAddress,
        user_phone: req.body.UserPhone
    }

    userModel.update(entity).then(n => {
        res.redirect('/admin/users/editors'); //Pay attention /admin/./ not admin/./ to go out from this url
    }).catch(err => {
        console.log(err);
    });
});




router.get('/subscribers', (req, res) => {
    var p = userModel.allSubscriber();
    p.then(rows => {
        res.render('admin/vwAdmin/vwSubscriber/subscribers', { layout: 'admin', subscribers: rows });
    })

});


router.get('/editors/cancel', (req, res) => {
    res.redirect('/admin/users/editors')
})
router.get('/subscribers/edit/:id', (req, res) => {
    res.render('admin/vwAdmin/vwEditor/edit_editor', { layout: 'admin' });
})
module.exports = router;