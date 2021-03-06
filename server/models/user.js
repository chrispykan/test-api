
var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs') 


const userSchema = new mongoose.Schema({  
  name: String,
  email: {type: String, unique: true, lowercase: true},
  password: String
});

// On Save Hook, encrypt password

userSchema.pre('save', function (next) {
  const user = this;
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });

  });
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
}


mongoose.model('User', userSchema);
module.exports = mongoose.model('User');
