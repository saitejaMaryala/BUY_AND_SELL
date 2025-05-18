const mongoose = require("mongoose");

const orderHistorySchema = mongoose.Schema(
    {
        prodId: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        otp:String,
        Delivered:String,
        TransactionId: String,
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

const orderHistoryModel = mongoose.model("orderHistory", orderHistorySchema);

module.exports = orderHistoryModel;
