/**
 * Created by Administrator on 2017/9/2.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;
var UserSchema = new mongoose.Schema({
    name : {
        unique : true,
        type : String
    },
    password : String,
    meta : {
        createAt : {
            type : Date,
            default : Date.now()
        },
        updateAt : {
            type : Date,
            default : Date.now()
        }
    }
});

UserSchema.pre('save',function(next){
    var user = this;
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err){
            console.log(err);
        }else{
            bcrypt.hash(user.password, salt,null, function(err, hash){
                if(err){
                    console.log(err);
                }else{
                    user.password = hash;
                    next();
                }
            })
        }
    });
});
//实例方法，通过实例调取
UserSchema.methods = {
  comparePassword : function(password, cb){
      bcrypt.compare(password, this.password, function(err, isMatch){
          if(err){
              console.log(err);
              cb(err);
          }
          cb(null, isMatch);
      })

  }
};

//静态方法，通过模型即可调取
UserSchema.statics = {
    fetch : function(cb){
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById : function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb)
    }
};

module.exports = UserSchema;