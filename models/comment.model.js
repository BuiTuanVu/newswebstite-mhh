var db = require('../utils/db');
module.exports = {
    all: () => {
        return db.load('select * from comment');
    },
    add: entity => {
        return db.add('comment', entity);
    },
};