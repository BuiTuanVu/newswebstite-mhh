var express = require('express');
var postModel = require('../../models/post.model');
var cateModel = require('../../models/category.model');
var userModel = require('../../models/user.model')
const bodyParser = require('body-parser');
var router = express.Router();

router.get('/posts_writer', (req, res) => {
    
    var page = req.query.page || 1;
    if(page < 1) page = 1;
    var limit = 8;

    var offset = (page - 1) * limit;

    Promise.all([postModel.pageByNone(limit, offset),
    postModel.countByNone()]).then(([rows,count_rows]) => {
        var q = cateModel.all();
        q.then(cates => {
            var total = count_rows[0].total;
            var nPages = Math.floor(total / limit);
            if(total % limit > 0) nPages++;
            var pages = [];
            for(i = 1; i <= nPages; i++){
                var obj = {value: i, active: i===+page};
                pages.push(obj);
            }
            res.render('admin/vwPosts_Writer/posts_writer', { layout: 'admin', posts: rows, cates: cates, pages});
        })

    })
    .catch(err => {
        console.log(err);
        res.end('error')
    });
    
});

router.get('/addpost_writer', (req, res) => {
    var p = postModel.allCateNoChild();
    p.then(rows => {
        userModel.allEditor().then(editors => {
            res.render('admin/vwPosts_Writer/addpost_writer', { layout: 'admin', editors: editors,categories: rows})
        })
       
    }).catch(err => {
        console.log(err)
    });
});

router.post('/addpost_writer', (req, res) => {


    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    var entity = {
        post_title: req.body.PostTitle,
        post_des: req.body.PostDes,
        post_content: req.body.PostContent,
        post_image:'/imgs/' + req.body.PostAvatar,
        post_cate_id: req.body.PostCateID, 
        post_tag: req.body.PostTag,
        post_user_id: req.body.PostUserID, 
        post_date: dateTime,
       post_stt: 0,
       post_view: 0,
    }

    
    postModel.add(entity).then(id => {
        var p = postModel.all();
        p.then(rows => {
            res.render('admin/vwPosts_Writer/posts_writer', { layout: 'admin', posts: rows});
           
        });

    }).catch(err => {
        console.log(err);
    });
    
});


router.get('/searchCate/:id', (req,res) => {
    
    var idCate = req.params.id;

    var page = req.query.page || 1;
    if(page < 1) page = 1;
    var limit = 8;

    var offset = (page - 1) * limit;

    Promise.all([postModel.pageByCat(idCate, limit, offset),
    postModel.countByCat(idCate)]).then(([rows,count_rows]) => {
        var q = cateModel.all();
        q.then(cates => {
            var total = count_rows[0].total;
            var nPages = Math.floor(total / limit);
            if(total % limit > 0) nPages++;
            var pages = [];
            for(i = 1; i <= nPages; i++){
                var obj = {value: i, active: i===+page};
                pages.push(obj);
            }
            res.render('admin/vwPosts_Writer/posts_writer', { layout: 'admin', posts: rows, cates: cates, pages, cate: req.params.id});
        })

    })
    .catch(err => {
        console.log(err);
        res.end('error')
    });

 });
 
 router.get('/searchStatus/:id', (req,res) => {
     
     var idStt = req.params.id;

     var page = req.query.page || 1;
    if(page < 1) page = 1;
    var limit = 8;

    var offset = (page - 1) * limit;

    Promise.all([postModel.pageByStt(idStt, limit, offset),
    postModel.countByStt(idStt)]).then(([rows,count_rows]) => {
        var q = cateModel.all();
        q.then(cates => {
            var total = count_rows[0].total;
            var nPages = Math.floor(total / limit);
            if(total % limit > 0) nPages++;
            var pages = [];
            for(i = 1; i <= nPages; i++){
                var obj = {value: i, active: i===+page};
                pages.push(obj);
            }
            res.render('admin/vwPosts_Writer/posts_writer', { layout: 'admin', posts: rows, cates: cates, pages, stt: req.params.id});
        })

    })
    .catch(err => {
        console.log(err);
        res.end('error')
    });

     
  });






module.exports = router;