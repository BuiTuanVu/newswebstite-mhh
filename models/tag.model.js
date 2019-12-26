var db = require('../utils/db');
module.exports = {
  all: () => {
    return db.load('select * from tags');
  },
  add: entity => {
    return db.add('tags', entity);
  },
};