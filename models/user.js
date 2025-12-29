const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email:{type:String,required:true},
    username:{type:String,required:true},
});

userSchema.plugin(passportLocalMongoose.default);
// ^ automatically adds username and hashed password, salt,
// some methods also like authenticate, serializeUser etc.

module.exports = mongoose.model('User', userSchema);
