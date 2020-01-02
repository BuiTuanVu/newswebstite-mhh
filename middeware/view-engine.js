var exphbs = require('express-handlebars');
var hbs_sections = require('express-handlebars-sections');
var userModel = require('../models/user.model');
var cateModel = require('../models/category.model');
var path = require('path');

module.exports = function (app) {
  app.engine('hbs', exphbs({
    extname: 'hbs',
    layoutsDir: 'views/layouts',
    defaultLayout: 'layout',
    helpers: {
      section: hbs_sections(),
      if_eq: function (a, b, opts) {
        if (a == b) {
          return opts.fn(this);
        } else {
          return opts.inverse(this);
        }
      },
      switch: function (value, options) {
        this._switch_value_ = value;
        var html = options.fn(this); // Process the body of the switch block
        delete this._switch_value_;
        return html;
      },
      case: function (value, options) {
        if (value == this._switch_value_) {
          return options.fn(this);
        }
      },

      formatDate: val => {
        return val.toLocaleString();
      },

      nameAuthor: val => {
        userModel.single(val).then(rows => {
          return rows[0].user_name;
        })
      },
      cateName: val => {
        cateModel.single(val).then(row => {
          return row[0].cate_name;
        })
      },

      cateLast: () => {
        cateModel.all().then(rows => { return 1 })
      }
    }
  }));
  app.set('view engine', 'hbs');
}