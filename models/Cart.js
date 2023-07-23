const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true },
        products: [
            {
                productId:{
                    type:mongoose.SchemaTypes.ObjectId,
                    ref: 'Product',
                },
                quantity:{
                    type:Number,
                    default: 1,
                },
            },
        ],
        total:{type:Number},
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);