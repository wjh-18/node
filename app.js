/**
 * Created by Administrator on 2017/9/2.
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var moment = require('moment');
var _ = require('underscore');
var port = process.env.PORT ||3000;
var app = express();
app.locals.moment = moment;
var mongoose = require('mongoose');
var Movie = require('./models/movie');

mongoose.connect("mongodb://localhost:27017/movie");
// mongoose.createConnection('localhost', 'movie', 27017, {user: 'wjh', pass: '123456'});


mongoose.connection.on('connect', function(){
    console.log("mongoose connection open to mongodb://localhost:27017/movie")
});
mongoose.connection.on('error', function(err){
    console.log("mongoose err: " + err)
});

app.set('views','./views/pages');
app.set('view engine', 'pug');
app.set('port', port);
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, "public")));


app.listen(port);
console.log('app started on port ' + port);

//index page
app.get('/',function(req, res){
    Movie.fetch(function(err, movies){
        if(err){
            console.log(err);
        }
        res.render('index', {
            title: '电影网站首页',
            movies: movies
        })
    })

});


//detail page
app.get('/movie/:id',function(req, res){
    var id = req.params.id;
    Movie.findById(id, function(err, movie){
        if(err){
            console.log(err);
        }
        res.render('detail', {
            title: '电影详情',
            movie: movie
        })
    })

});

//admin page
app.get('/admin/movie',function(req, res){
    res.render('admin', {
        title: '电影录入',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
});

//admin update movie
app.get('/admin/update/:id',function(req, res){
    var id = req.params.id;
    if(id !== undefined){
        Movie.findById(id, function(err, movie){
            res.render('admin', {
                title : "update movie",
                movie : movie
            })
        })
    }
})

//admin post movie
app.post('/admin/movie/new', function(req, res){
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    console.log('id : '+id);
    if(id && id !== 'undefined'){
        Movie.findById(id, function(err, movie){
            if(err){
                console.log(err)
            }else{
                _movie = _.extend(movie, movieObj);
                _movie.save(function(err, movie){
                    if(err){
                        console.log(err);
                    }
                    res.redirect('/movie/'+ movie._id );
                })
            }

        })
    }else{
        _movie = new Movie({
            doctor : movieObj.doctor,
            title : movieObj.title,
            language : movieObj.language,
            country : movieObj.country,
            poster : movieObj.poster,
            flash : movieObj.flash,
            summary : movieObj.summary,
            year : movieObj.year,

        });
        _movie.save(function(err, movie){
            if(err){
                console.log(err);
            }else{
                res.redirect('/movie/' + _movie.id)
            }

        })
    }
})


//list page
app.get('/admin/list',function(req, res){
    Movie.fetch(function(err, movies){
        if(err){
            console.log(err);
        }
        res.render('list', {
            title: '电影列表',
            movies: movies
        })
    })

});

//list delete movie
app.delete('/admin/list',function(req, res){
    var id = req.query.id;
    if(id){
        Movie.remove({_id : id},function(err, movie){
            if(err){
                console.log(err);
            }else{
                res.json({success : 1})
            }
        })
    }
})
