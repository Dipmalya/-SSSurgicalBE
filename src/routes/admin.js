const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const uniqid = require("uniqid");
const jwt = require("jsonwebtoken");

const Product = require("../models/product.model");
const jwtMWare = require("../webtoken/middleware");
const userData = require("../mocks/user.json");

const formLinkId = (name = "") => {
  if (name !== "") {
    let nameInitials = name.replace(/\s/g, '').toLowerCase();
    return `${nameInitials}-s&s`;
  }
};

router.post("/adminLogin", (req, res, next) => {
  const {
    email = "",
    password = ""
  } = req.body;
  const validUser = userData.find(user => (user.email === email && user.password === password)) || {};
  if (validUser.id) {
    const token = jwt.sign({ email }, jwtMWare.secret, {
      expiresIn: "6h"
    });
    delete validUser.password;
    res.status(200).json({
      ...validUser,
      token,
      success: true
    });
  } else {
    res.status(500).json({
      message: "Username or Password is invalid",
      success: false
    })
  }
})

router.post("/addProduct", jwtMWare.checkToken, (req, res, next) => {
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

router.put("/editProduct/:itemId", jwtMWare.checkToken, (req, res, next) => {
  const itemId = req.params.itemId;
  Product.findOneAndUpdate({ itemId }, req.body)
  .exec()
  .then(() => {
    res.status(200).json({
      message: "Product updated successfully",
      success: true
    });
  })
  .catch((err) => {
    res.status(500).json({
      err,
      message: "Failed to update product",
      success: false,
    });
  });
});

router.delete("/removeProduct/:itemId", jwtMWare.checkToken, (req, res, next) => {
  const itemId = req.params.itemId;
  Product.findOneAndDelete({ itemId })
  .exec()
  .then(() => {
    res.status(200).json({
      message: "Product deleted successfully",
      success: true
    });
  })
  .catch((err) => {
    res.status(500).json({
      err,
      message: "Failed to delete product",
      success: false,
    });
  });
});

module.exports = router;
