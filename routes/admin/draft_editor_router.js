var express = require('express');
var postModel = require('../../models/post.model');
var cateModel = require('../../models/category.model');
const bodyParser = require('body-parser');
var router = express.Router();

router.get('/pending-posts', (req, res) => {

    var idStt = 0;

    var page = req.query.page || 1;
    if (page < 1) page = 1;
    var limit = 8;

    var offset = (page - 1) * limit;

    Promise.all([postModel.pageByStt(idStt, limit, offset),
    postModel.countByStt(idStt)]).then(([rows, count_rows]) => {
        var q = cateModel.all();
        q.then(cates => {
            var total = count_rows[0].total;
            var nPages = Math.floor(total / limit);
            if (total % limit > 0) nPages++;
            var pages = [];
            for (i = 1; i <= nPages; i++) {
                var obj = { value: i, active: i === +page };
                pages.push(obj);
            }
            res.render('admin/vwEditor/drafts_editor', { layout: 'admin', posts: rows, cates: cates, pages, stt: 0 });
        })

    })
        .catch(err => {
            console.log(err);
            res.end('error')
        });
});

router.get('/rejected-posts', (req, res) => {

    var idStt = -1;

    var page = req.query.page || 1;
    if (page < 1) page = 1;
    var limit = 8;

    var offset = (page - 1) * limit;

    Promise.all([postModel.pageByStt(idStt, limit, offset),
    postModel.countByStt(idStt)]).then(([rows, count_rows]) => {
        var q = cateModel.all();
        q.then(cates => {
            var total = count_rows[0].total;
            var nPages = Math.floor(total / limit);
            if (total % limit > 0) nPages++;
            var pages = [];
            for (i = 1; i <= nPages; i++) {
                var obj = { value: i, active: i === +page };
                pages.push(obj);
            }
            res.render('admin/vwEditor/drafts_editor', { layout: 'admin', posts: rows, cates: cates, pages, stt: -1 });
        })

    })
        .catch(err => {
            console.log(err);
            res.end('error')
        });
});


router.get('/published-posts', (req, res) => {

    var idStt = 1;

    var page = req.query.page || 1;
    if (page < 1) page = 1;
    var limit = 8;

    var offset = (page - 1) * limit;

    Promise.all([postModel.pageByStt(idStt, limit, offset),
    postModel.countByStt(idStt)]).then(([rows, count_rows]) => {
        var q = cateModel.all();
        q.then(cates => {
            var total = count_rows[0].total;
            var nPages = Math.floor(total / limit);
            if (total % limit > 0) nPages++;
            var pages = [];
            for (i = 1; i <= nPages; i++) {
                var obj = { value: i, active: i === +page };
                pages.push(obj);
            }
            res.render('admin/vwEditor/drafts_editor', { layout: 'admin', posts: rows, cates: cates, pages, stt: 1 });
        })

    })
        .catch(err => {
            console.log(err);
            res.end('error')
        });
});

router.get('/searchCate/:id', (req, res) => {

    var idCate = req.params.id;

    var page = req.query.page || 1;
    if (page < 1) page = 1;
    var limit = 8;

    var offset = (page - 1) * limit;

    Promise.all([postModel.pageByCat(idCate, limit, offset),
    postModel.countByCat(idCate)]).then(([rows, count_rows]) => {
        var q = cateModel.allCateNoChild();
        q.then(cates => {
            var total = count_rows[0].total;
            var nPages = Math.floor(total / limit);
            if (total % limit > 0) nPages++;
            var pages = [];
            for (i = 1; i <= nPages; i++) {
                var obj = { value: i, active: i === +page };
                pages.push(obj);
            }
            res.render('admin/vwEditor/drafts_editor', { layout: 'admin', posts: rows, cates: cates, pages, cate: req.params.id });
        })

    })
        .catch(err => {
            console.log(err);
            res.end('error')
        });
});

router.get('/searchStatus/:id', (req, res) => {

    var idStt = req.params.id;

    var page = req.query.page || 1;
    if (page < 1) page = 1;
    var limit = 8;

    var offset = (page - 1) * limit;

    Promise.all([postModel.pageByStt(idStt, limit, offset),
    postModel.countByStt(idStt)]).then(([rows, count_rows]) => {
        var q = cateModel.all();
        q.then(cates => {
            var total = count_rows[0].total;
            var nPages = Math.floor(total / limit);
            if (total % limit > 0) nPages++;
            var pages = [];
            for (i = 1; i <= nPages; i++) {
                var obj = { value: i, active: i === +page };
                pages.push(obj);
            }
            res.render('admin/vwEditor/drafts_editor', { layout: 'admin', posts: rows, cates: cates, pages, stt: req.params.id });
        })

    })
        .catch(err => {
            console.log(err);
            res.end('error')
        });
});



router.get('/reject/:id', (req, res) => {

    var p = postModel.single(req.params.id).then(row => {
        var cur = row[0]


        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        var entity = {
            post_id: req.params.id,
            post_title: cur.post_title,
            post_des: cur.post_des,
            post_content: cur.post_content,
            post_image: cur.post_image,
            post_cate_id: cur.post_cate_id,
            post_tag: cur.post_tag,
            post_user_id: cur.post_user_id,
            post_date: dateTime,
            post_stt: -1,
        }

        postModel.update(entity).then(n => {
            res.redirect('/admin/drafts/pending-posts'); //Pay attention /admin/./ not admin/./ to go out from this url
        }).catch(err => {
            console.log(err);
        });
    });
});


router.get('/view-detail/:id', (req, res) => {
    postModel.single(req.params.id).then(rows => {
        postModel.relatedPost(req.params.id).then(relatedPosts => {
            res.render('admin/vwEditor/pre_view_draft', { title: 'NEWS', post: rows[0], relatedPosts: relatedPosts, id: req.params.id });
        })
    }).catch(err => {
        console.log(err)
    });
});

router.get('/setup/:id', (req, res) => {
    postModel.single(req.params.id).then(rows => {
        res.render('admin/vwEditor/setup', { title: 'NEWS', layout: 'admin', post: rows[0], id: req.params.id });
    }).catch(err => {
        console.log(err)
    });
})
router.post('/accept/:id', (req, res) => {

    var p = postModel.single(req.params.id).then(row => {
        var cur = row[0]


        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        var entity = {
            post_id: req.params.id,
            post_title: cur.post_title,
            post_des: cur.post_des,
            post_content: cur.post_content,
            post_image: cur.post_image,
            post_cate_id: cur.post_cate_id,
            post_tag: cur.post_tag,
            post_user_id: cur.post_user_id,
            post_date: dateTime,
            post_stt: 1,
            post_vip: req.body.TypePost
        }

        postModel.update(entity).then(n => {
            res.redirect('/admin/drafts/pending-posts'); //Pay attention /admin/./ not admin/./ to go out from this url
        }).catch(err => {
            console.log(err);
        });
    });
});



module.exports = router;