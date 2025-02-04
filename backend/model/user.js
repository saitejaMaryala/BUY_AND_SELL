const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    age:Number,
    contactNumber:String,
    password:String
});

const userModel = mongoose.model("users",userSchema);

module.exports = userModel;