const { Schema, model } = require("mongoose");

const statusValid = ["Pending", "Completed", "Cancel","In process"];
const OrderScheme = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
      comment: {
        type:String,
      },
    },
  ],
  status: {
    type: String,
    default: "Pending",
    enum: statusValid,
  },
 
  total: {
    type: Number,
    default: 0,
  },
});

module.exports = model("Order", OrderScheme);
