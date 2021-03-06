var express = require('express');
var cateModel = require('../../models/category.model');
var postModel = require('../../models/post.client.model');
var commentModel = require('../../models/comment.model')
var router = express.Router();


router.get('/', (req, res, next) => {
    Promise.all([
        postModel.newestEachCate(),
        postModel.topView(10),
        postModel.preView(1, 0),
        postModel.preView(2, 1),
        postModel.preView(3, 3),
        postModel.recentNews(4, 0),
        postModel.recentNews(6, 4)]).then(([newestEachCate, topViews, topViews01, topViews02, topViews03, recentNews01, recentNews02]) => {

            res.render('user/home', { title: 'HOME', newestEachCate, topViews, topViews01, topViews02, topViews03, recentNews01, recentNews02 });
        }).catch(err => {
            res.end(err);
        });


});

router.get('/home', (req, res, next) => {
    Promise.all([
        postModel.newestEachCate(),
        postModel.topView(10),
        postModel.preView(1, 0),
        postModel.preView(2, 1),
        postModel.preView(3, 3),
        postModel.recentNews(4, 0),
        postModel.recentNews(6, 4)]).then(([newestEachCate, topViews, topViews01, topViews02, topViews03, recentNews01, recentNews02]) => {

            res.render('user/home', { title: 'HOME', newestEachCate, topViews, topViews01, topViews02, topViews03, recentNews01, recentNews02 });
        }).catch(err => {
            res.end(err);
        });


});


router.get('/cate/:id', (req, res) => {

    postModel.cateChild(req.params.id).then(p => {


        if (p.length > 0) {

            var child1 = parseInt((p[0].cate_id).toString())
            var child2 = parseInt((p[1].cate_id).toString())

            var page = req.query.page || 1;
            if (page < 1) page = 1;
            var limit = 8;

            var offset = (page - 1) * limit;

            Promise.all([postModel.topView(5),
            postModel.getCateName(p[0].cate_parent), postModel.pageByCat(child1, limit / 2, offset), postModel.pageByCat(child2, limit / 2, offset),
            postModel.countByCat(child1), postModel.countByCat(child2)]).then(([topView, cate, rows01, rows02, count_rows01, count_rows02]) => {

                var total = (count_rows01[0]).total + (count_rows02[0]).total;
                var nPages = Math.floor(total / limit);
                if (total % limit > 0) nPages++;
                var pages = [];
                for (i = 1; i <= nPages; i++) {
                    var obj = { value: i, active: i === +page };
                    pages.push(obj);
                }

                res.render('user/posts', { topView, rows01, rows02, pages, isParent: true, cate: cate[0].cate_name })
            }).catch(err => {
                console.log(err);
            })
        }
        else {

            var idCate = req.params.id;


            var page = req.query.page || 1;
            if (page < 1) page = 1;
            var limit = 8;

            var offset = (page - 1) * limit;

            Promise.all([postModel.topView(5),
            postModel.getCateName(idCate), postModel.pageByCat(idCate, limit, offset),
            postModel.countByCat(idCate)]).then(([topView, catename, rows, count_rows]) => {
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
                    res.render('user/posts', { topView, cate: catename[0].cate_name, posts: rows, cates: cates, pages, isParent: false })
                }).catch(err => {
                    console.log(err)
                });

            });

        }
    });

});

router.get('/posts/:id', (req, res) => {
    postModel.single(req.params.id).then(rows => {
        postModel.getCommentOfPost(req.params.id).then(comments => {
            postModel.relatedPost(req.params.id).then(relatedPosts => {
                res.render('user/single_post', { title: 'NEWS', post: rows[0], relatedPosts: relatedPosts, comments: comments, num_cmt: comments.length, id: req.params.id });
            })

        })



    }).catch(err => {
        console.log(err)
    });
});

router.get('/login', (req, res, next) => {
    res.render('admin/login1', { layout: "admin" });
});

router.get('/signup', (req, res, next) => {
    res.render('admin/register1', { layout: "admin" });
});

router.get('/forgot-password', (req, res, next) => {
    res.render('admin/forgot-password', { layout: "admin" });
});

router.get('/contact', (req, res, next) => {
    res.render('user/contact', { title: 'CONTRACT' });
});

router.get('/about', (req, res, next) => {
    res.render('user/faq', { title: 'ABOUT' });
})

router.post('/add-comment/:id/:user', (req, res) => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    var entity = {
        id_post: req.params.id,
        comment: req.body.comment,
        name_user: req.params.user,
        doc: dateTime
    }
    commentModel.add(entity).then(rows => {
        res.redirect(`/posts/${req.params.id}`);
    })
})

module.exports = router;
