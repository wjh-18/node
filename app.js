/**
 * Created by Administrator on 2017/9/2.
 */
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var moment = require('moment');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var port = process.env.PORT ||3000;
var app = express();
var dbUrl = "mongodb://localhost:27017/movie";

mongoose.connect(dbUrl);




app.set('views','./views/pages');
app.set('view engine', 'pug');
app.set('port', port);
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(session({
    secret : 'movie',
    store : new mongoStore({
        url: dbUrl,
        collection : "sessions"
    })
}));

if("development" === app.get('env')){
    app.set('showStackError', true);
    app.use(morgan(":method :url :status"));
    app.locals.pretty = true;
    mongoose.set('debug', true);
}

require("./config/routes")(app);

app.listen(port);
app.locals.moment = moment;

