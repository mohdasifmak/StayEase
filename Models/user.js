const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    name:{
         type: String,
         require: true,
    },
    email:{
        type: String,
        requied: true,
    },
});

userSchema.plugin(passportLocalMongoose);  //user plugin automatic add the username and password and apply salting and hashing.

module.exports = mongoose.model("User", userSchema);