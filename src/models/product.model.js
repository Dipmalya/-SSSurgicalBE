const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.SchemaTypes.ObjectId,
  itemId: String,
  itemName: String,
  category: String,
  categoryId: String,
  subCategory: String,
  subCategoryId: String,
  itemPrice: String,
  priceSpecs: String, //each/set, etc
  size: String,
  itemDesc: String,
  imageUrl: String,
  priceGiven: Boolean
});

module.exports = mongoose.model("products", userSchema, "product-data");
