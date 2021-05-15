const express = require("express");
const router = express.Router();

const Product = require("../models/product.model");

const formLinkId = (name = "") => {
  if (name !== "") {
    let nameInitials = name.replace(/\s/g, "").toLowerCase();
    return `${nameInitials}-s&s`;
  }
};

router.get("/", (req, res, next) => {
  Product.find({})
    .exec()
    .then((items) => res.status(200).json(items));
});

router.get("/:itemId", (req, res, next) => {
  const itemId = req.params.itemId;
  Product.findOne({ itemId })
    .exec()
    .then((item) => res.status(200).json(item))
    .catch(() => {
      res.status(500).json({
        message: "Failed to load",
        success: false,
      });
    });
});

router.get("/get/categoryList", (req, res, next) => {
  const response = [];
  Product.find({})
    .distinct("category")
    .exec()
    .then((items) =>
      items.map((item) => {
        Product.find({ category: item })
          .distinct("subCategory")
          .exec()
          .then((obj) => {
            const options = [];
            if (obj.length) {
              obj.map((data) => {
                const optionObj = {
                  subCategory: data,
                  link: formLinkId(data),
                };
                options.push(optionObj);
              });
            }
            const data = {
              category: item,
              link: options.length ? undefined : formLinkId(item),
              options: options.length ? options : undefined,
            };
            response.push(data);
            if (response.length === items.length) {
              res.status(200).json(response);
            }
          })
          .catch(() => {
            res.status(500).json({
              message: "Failed to load",
              success: false,
            });
          });
      })
    )
    .catch(() => {
      res.status(500).json({
        message: "Failed to load",
        success: false,
      });
    });
});

router.get("/getItemByCategory/:categoryId", (req, res, next) => {
  const categoryId = req.params.categoryId;
  Product.find({ categoryId })
    .exec()
    .then((items) => res.status(200).json(items))
    .catch(() => {
      res.status(500).json({
        message: "Failed to load",
        success: false,
      });
    });
});

router.get("/getItemBySubCategory/:subCategoryId", (req, res, next) => {
    const subCategoryId = req.params.subCategoryId;
    Product.find({ subCategoryId })
      .exec()
      .then((items) => res.status(200).json(items))
      .catch(() => {
        res.status(500).json({
          message: "Failed to load",
          success: false,
        });
      });
  });

module.exports = router;
