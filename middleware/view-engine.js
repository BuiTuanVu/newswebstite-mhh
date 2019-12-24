var exphbs = require('express-handlebars');
var hbs_sections = require('express-handlebars-sections');
var path = require('path');

module.exports = function (app) {
    app.engine('hbs', exphbs({
        extname: 'hbs',
        layoutsDir: 'views/layouts',
        defaultLayout: 'layout',
    }));
    app.set('view engine', 'hbs');
}