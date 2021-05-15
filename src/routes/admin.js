const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const uniqid = require("uniqid");

const Product = require("../models/product.model");

const formLinkId = (name = "") => {
  if (name !== "") {
    let nameInitials = name.replace(/\s/g, '').toLowerCase();
    return `${nameInitials}-s&s`;
  }
};

router.post("/addProduct", (req, res, next) => {
  const item = req.body;
  const { subCategory = undefined } = item;
  const newProduct = new Product({
    _id: new mongoose.Types.ObjectId(),
    itemId: uniqid.time(),
    categoryId: item.subCategory ? undefined : formLinkId(item.category),
    itemName: item.itemName,
    category: item.category,
    subCategory: subCategory,
    subCategoryId: item.subCategory ? formLinkId(item.subCategory) : undefined,
    itemPrice: item.itemPrice,
    priceSpecs: item.priceSpecs,
    size: item.size,
    itemDesc: item.itemDesc,
    imageUrl:
      item.imageUrl ||
      "https://www.alimed.com/_resources/cache/images/product/98FCP47-1_1000x1000-pad.jpg",
    priceGiven: item.itemPrice ? true : false,
  });
  newProduct
    .save()
    .then((item) => {
      res.status(200).json({
        message: "Product added successfully",
        success: true,
        item,
      });
    })
    .catch((err) => {
      res.status(500).json({
        err,
        message: "Failed to add product",
        success: false,
      });
    });
});

module.exports = router;
