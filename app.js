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

require('./middeware/view-engine')(app);// view engine hbs


app.get('/', (req, res) => {
    res.send('Hello world1')
})
app.listen(3000);
console.log('Server is running at port: 3000');