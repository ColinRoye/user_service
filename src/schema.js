var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var UserServiceSchema = new mongoose.Schema({
     username: {
          type: String,
          unique: true,
     },
     following: [String],
     followers: [String]
});

UserServiceSchema.plugin(uniqueValidator, {message: 'is already in use.'});

mongoose.model('UserService', UserServiceSchema);
