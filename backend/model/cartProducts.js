const mongoose = require("mongoose");

const cartproductSchema = mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId, ref: "products"
    },
    userId:String
},{
    timestamps:true
}
);

const cartProductModel = mongoose.model("cartProducts", cartproductSchema);

module.exports = cartProductModel;