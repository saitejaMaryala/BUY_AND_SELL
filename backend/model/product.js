const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    description: String,
    status:String,
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const productModel = mongoose.model("products", productSchema);

module.exports = productModel;