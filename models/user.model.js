var db = require('../utils/db');
module.exports = {
    allEditor: () => {
        return db.load('select * from users where user_role != 0');
    },

    allSubscriber: () => {
        return db.load('select * from users where user_role = 0');
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

    allByCate: cate_id => {
        return db.load(`select * from posts where post_cate_id = ${cate_id}`);
    },

    pageByCat: (cate_id, limit, offset) => {
        return db.load(`select * from posts where post_cate_id = ${cate_id} limit ${limit} offset ${offset}`);
      },
    
      countByCat: cate_id => {
        return db.load(`select count(*) as total from posts where post_cate_id = ${cate_id}`);
      },
    
      single: id => {
        return db.load(`select * from users where user_id = ${id}`);
      },
    
      singleByUserName: userName => {
        return db.load(`select * from users where user_account = '${userName}'`);
      },
      add: entity => {
        return db.add('users', entity);
      },
    
      update: entity => {
        return db.update('users', 'user_id', entity);
      },
    
      delete: id => {
        return db.delete('users', 'user_id', id);
      },
};

