var express = require('express');
var postModel = require('../models/post.model');
var userModel = require('../models/user.model');
var router = express.Router();

router.get('/:id/posts', (req, res, next) => {
  var id = req.params.id;
  var page = req.query.page || 1;
  if (page < 1) page = 1;

  var limit = 6;
  var offset = (page - 1) * limit;


  Promise.all([
    postModel.pageByCat(id, limit, offset),
    postModel.countByCat(id),
  ]).then(([rows, count_rows]) => {
    for (const c of res.locals.lcCategories) {
      if (c.CatID === +id) {
        c.isActive = true;
      }
    }

    var total = count_rows[0].total;
    var nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;
    var pages = [];
    for (i = 1; i <= nPages; i++) {
      var obj = { value: i, active: i === +page };
      pages.push(obj);
    }

    res.render('vwPosts/allposts_writer', {
        layout: 'admin',
      posts: rows,
      pages
    });
  }).catch(next);
})

module.exports = router;
