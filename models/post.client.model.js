var db = require('../utils/db');
module.exports = {
  all: () => {
    return db.load('select * from posts where post_stt = 1');
  },

  allCateNoChild: () => {
    return db.load(`SELECT * 
        FROM categories c
        WHERE cate_parent IS NOT NULL 
        OR 
        (
          cate_parent IS NULL 
          AND NOT EXISTS (SELECT * FROM categories pc WHERE pc.cate_parent = c.cate_id)
        )`);
  },

  // post for client side
  preView: (limit, offset) => {
    return db.load(`SELECT * FROM (SELECT @row := @row + 1 AS stt, t.*
    FROM posts t, (SELECT @row := 0) r WHERE post_vip = 1 and post_stt = 1 ORDER BY post_date DESC LIMIT ${limit} offset ${offset}) q JOIN categories c on q.post_cate_id = c.cate_id`)
  },

  recentNews: (limit, offset) => {
    return db.load(`SELECT * FROM (SELECT @row := @row + 1 AS stt, t.*
    FROM posts t, (SELECT @row := 0) r WHERE post_stt = 1 ORDER BY post_date DESC LIMIT ${limit} offset ${offset}) q JOIN categories c on q.post_cate_id = c.cate_id`);
  },

  topView: (limit) => {
    return db.load(`SELECT * FROM (SELECT @row := @row + 1 AS stt, t.*
      FROM posts t, (SELECT @row := 0) r WHERE post_stt = 1 ORDER BY post_view DESC LIMIT ${limit}) q JOIN categories c on q.post_cate_id = c.cate_id`)
  },

  newestEachCate: () => {
    return db.load(`SELECT * FROM 
    (SELECT t.* FROM (SELECT *
        FROM (SELECT * FROM posts WHERE post_stt = 1 ORDER BY post_date DESC ) 
        AS timePost GROUP BY post_cate_id ORDER BY post_cate_id ASC LIMIT 0,10) t) s JOIN categories c on s.post_cate_id = c.cate_id`)
  },



  allByCate: cate_id => {
    return db.load(`select * from posts where post_cate_id = ${cate_id} and post_stt = 1`);
  },

  allByStt: stt_id => {
    return db.load(`select * from posts where post_stt = ${stt_id} and post_stt = 1 `);
  },

  cateParent: (cateChild) => {
    return db.load(`SELECT c.cate_parent
    FROM (
        SELECT
            @r AS _id,
            (SELECT @r := cate_parent FROM categories WHERE cate_id = _id) AS parent_id,
            @l := @l + 1 AS level
        FROM
            (SELECT @r := ${cateChild}, @l := 0) vars, categories m
        WHERE @r <> 0) d
    JOIN categories c
    ON d._id = c.cate_id`)
  },

  cateChild: (cate_id) => {
    return db.load(`select * from categories where cate_parent = ${cate_id}`);
  },

  pageByCat: (cate_id, limit, offset) => {
    return db.load(`select * from posts where post_cate_id = ${cate_id} limit ${limit} offset ${offset}`);
  },

  getCateName: (cateid) => {
    return db.load(`select * from categories where cate_id = ${cateid}`)
  },


  single: id => {
    return db.load(`select * , (SELECT cate_name FROM categories WHERE post_cate_id = cate_id) as cate_name from posts where post_id = ${id} and post_stt = 1`);
  },

  countByCat: cate_id => {
    return db.load(`select count(*) as total from posts where post_cate_id = ${cate_id} and post_stt = 1`);
  },

  countByStt: idStt => {
    return db.load(`select count(*) as total from posts where post_stt = ${idStt}`);
  },

  countByNone: () => {
    return db.load(`select count(*) as total from posts`);
  },



  relatedPost: id => {
    return db.load(`select * from posts where post_id != ${id} and post_stt = 1 ORDER BY RAND() LIMIT 5`)
  },

  getCommentOfPost: id => {
    return db.load(`select * from comment where id_post = ${id}`)
  }
};