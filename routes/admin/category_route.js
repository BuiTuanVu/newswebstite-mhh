var express = require('express');
var categoryModel = require('../../models/category.model');
var userModel = require('../../models/user.model')

var router = express.Router();



router.get('/cates_admin', (req, res, next) => {
    var p = categoryModel.allWithDetails();
    p.then(rows => {

        var editors = userModel.allEditorRole();
        editors.then(editors => {
            console.log(rows);
            res.render('admin/vwAdmin/vwCategories/cates_admin', { layout: 'admin', categories: rows, editors: editors });
        })


    }).catch(err => {
        console.log(err);
    });

});
router.post('/cates_admin', (req, res) => {
    userModel.single(req.body.CateAuthor).then(user => {
        var entity = {
            cate_name: req.body.CateName,
            cate_des: req.body.CateDes,
            cate_parent: req.body.CateParent, //Auto get selected value in select
            user_id: req.body.CateAuthor,
            user_name: user[0].user_name,
        }
        categoryModel.add(entity).then(id => {

            var p = categoryModel.all();
            p.then(rows => {
                var editors = userModel.allEditorRole();
                editors.then(editors => {
                    res.render('admin/vwAdmin/vwCategories/cates_admin', { layout: 'admin', categories: rows, editors: editors });
                })
            });
        })
    })
        .catch(err => {
            console.log(err);
        });
});


router.get('/cate_edit/:id', (req, res, next) => {

    var id = req.params.id;
    if (isNaN(id)) {
        res.render('admin/404', {
            error: true
        });
    }
    categoryModel.single(id).then(rows => {
        if (rows.length > 0) {
            var p = categoryModel.all();
            p.then(allrow => {
                var editors = userModel.allEditorRole();
                editors.then(editors => {
                    res.render('admin/vwAdmin/vwCategories/edit', {
                        categories: allrow,
                        error: false,
                        category: rows[0],
                        layout: 'admin',
                        editors: editors

                    });
                })

            })

        } else {
            res.render('admin/vwAdmin/vwCategories/edit', {
                error: true,
                layout: 'admin',
            });
        }
    }).catch(err => {
        console.log(err);
        res.end('error occured.');
    });

});

router.post('/update', (req, res) => {

    userModel.single(req.body.CateAuthor).then(user => {
        var entity = {
            cate_name: req.body.CateName,
            cate_des: req.body.CateDes,
            cate_parent: req.body.CateParent, //Auto get selected value in select
            user_id: req.body.CateAuthor,
            user_name: user[0].user_name,
        }

        categoryModel.update(entity).then(n => {
            res.redirect('/admin/categories/cates_admin'); //Pay attention /admin/./ not admin/./ to go out from this url
        })
    })
        .catch(err => {
            console.log(err);
        });
});

router.get('/delete/:id', (req, res) => {
    console.log(req.params.id);
    categoryModel.delete(req.params.id).then(n => {
        res.redirect('/admin/categories/cates_admin');
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });

});



module.exports = router;