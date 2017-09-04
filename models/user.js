/**
 * Created by Administrator on 2017/9/2.
 */
var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('User',UserSchema);

module.exports = User;