const mongoose = require("mongoose");

const cartproductSchema = mongoose.Schema({
    productId:String,
    userId:String
},{
    timestamps:true
}
);

const cartProductModel = mongoose.model("cartProducts", cartproductSchema);

module.exports = cartProductModel;