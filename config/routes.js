/**
 * Created by Administrator on 2017/9/4.
 */

var Movie = require('../models/movie');
var User = require('../models/user');
var _ = require('underscore');

module.exports = function(app){
    app.use(function(req, res, next){
        var _user = req.session.user;
        if(_user){
            app.locals.user = _user;
        }
        next();
    });
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

    //signUp
    app.post('/user/signUp',function(req, res){
        var _user = req.body.user;
        User.find({name : _user.name},function(err, user){
            if(err){
                console.log(err);
            }
            if(user){
                return res.redirect('/');
            }else{
                var user = new User(_user);
                user.save(user,function(err, user){
                    if(err){
                        console.log(err);
                    }
                    res.redirect('/admin/userList');
                    // console.log('signUp success');
                })
            }

        });



    });

    //signIn
    app.post('/user/signIn', function(req, res){
        var _user = req.body.user;
        var name = _user.name;
        var password = _user.password;
        User.findOne({name : name}, function(err, user){
            if(err){
                console.log(err);
            }
            if(!user){
                return res.redirect('/');
            }
            user.comparePassword(password, function(err, isMatched){
                if(err){
                    console.log(err);
                }
                if(isMatched){
                    req.session.user = user;
                    res.redirect('/');
                }else{
                    // console.log('password is not matched!')
                }
            })
        })
    })

    //logout
    app.get('/logout', function(req, res){
        delete req.session.user;
        delete app.locals.user;
        res.redirect('/');
    });

    //user list
    app.get('/admin/userList', function(req, res){
        User.fetch(function(err, users){
            if(err){
                console.log(err);
            }
            res.render('userList', {
                title : 'User List',
                users : users
            })
        })
    })


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
        // console.log('id : '+id);
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
}