var db = require('../utils/db');
module.exports = {
    all: () => {
        return db.load('select * from categories');
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

    allWithDetails: () => {
        return db.load(
            `select c.cate_id, c.cate_name, c.cate_parent,c.user_name, count(p.post_id) as num_of_post
            from categories c left join posts p on c.cate_id = p.post_cate_id
            group by c.cate_id, c.cate_name`);
    },

    single: id => {
        return db.load(`select * from categories where cate_id = ${id}`);
    },

    add: entity => {
        return db.add('categories', entity);
    },

    update: entity => {
        return db.update('categories', 'cate_id', entity);
    },

    delete: id => {
        return db.delete('categories', 'cate_id', id);
    }
};