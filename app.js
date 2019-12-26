var express = require('express');
var app = express();
var path = require('path');
const bodyParser = require('body-parser');
var morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

//set engine
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

require('./middleware/view-engine')(app);// view engine hbs



app.use('/admin', require('./routes/admin/admin_router'));
app.use('/account', require('./routes/account.router'));

app.use((req, res, next) => {
    res.render('404', { layout: 'admin' });

})

app.use((error, req, res, next) => {
    res.render('error', {
        layout: false,
        message: error.message,
        error
    })
})
app.listen(3000);
console.log('Server is running at port: 3000');