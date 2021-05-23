const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.SchemaTypes.ObjectId,
  orderId: String,
  buyerName: String,
  address: String,
  pinCode: String,
  mobile: String,
  email: String,
  orderDate: String,
  isDelivered: Boolean,
  deliveryDate: String,
  isAccepted: Boolean,
  items: [{
    itemId: String,
    itemName: String,
    itemPrice: String,
    quantity: String
  }]
});

module.exports = mongoose.model("orders", orderSchema, "order-data");
