var express = require('express');
var categoryModel = require('../../models/category.model');

var router = express.Router();



router.get('/cates_admin', (req, res, next) => {
    var p = categoryModel.all();
    p.then(rows => {
        console.log(rows);
        res.render('admin/vwAdmin/vwCategories/cates_admin', { layout: 'admin', categories: rows });

    }).catch(err => {
        console.log(err);
    });

});
router.post('/cates_admin', (req, res) => {
    var entity = {
        cate_name: req.body.CateName,
        cate_des: req.body.CateDes,
        cate_parent: req.body.CateParent //Auto get selected value in select
    }

    categoryModel.add(entity).then(id => {

        var p = categoryModel.all();
        p.then(rows => {
            res.render('admin/vwAdmin/vwCategories/cates_admin', { layout: 'admin', categories: rows });
        });

    }).catch(err => {
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
                res.render('admin/vwAdmin/vwCategories/edit', {
                    categories: allrow,
                    error: false,
                    category: rows[0],
                    layout: 'admin',

                });
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
    var entity = {
        cate_id: req.body.CateID,
        cate_name: req.body.CateName,
        cate_des: req.body.CateDes,
        cate_parent: req.body.CateParent //Auto get selected value in select
    }

    categoryModel.update(entity).then(n => {
        res.redirect('/admin/categories/cates_admin'); //Pay attention /admin/./ not admin/./ to go out from this url
    }).catch(err => {
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