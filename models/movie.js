/**
 * Created by Administrator on 2017/9/2.
 */
var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie');
var Movie = mongoose.model('Movie',MovieSchema);

module.exports = Movie;