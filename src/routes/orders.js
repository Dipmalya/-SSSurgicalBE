const express = require("express");
const router = express.Router();
const moment = require("moment");
const mongoose = require("mongoose");
const uniqid = require("uniqid");

const Order = require("../models/order.model");
const mailer = require("../mailService");
const { ORDER_CUSTOMER, ORDER_SUBJECT } = require("../../constants");

router.get("/", (req, res, next) => {
  Order.find({})
    .exec()
    .then((items) => res.status(200).json(items));
});

router.get("/:orderId", (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findOne({ orderId })
    .exec()
    .then((item) => res.status(200).json(item))
    .catch(() => {
      res.status(500).json({
        message: "Failed to load",
        success: false,
      });
    });
});

router.put("/isAccepted/:orderId/:status", (req, res, next) => {
  const orderId = req.params.orderId;
  const status = req.params.status;
  Order.findOneAndUpdate({ orderId }, { isAccepted: status })
    .exec()
    .then(() => {
      res.status(200).json({
        message: "Order status updated successfully",
        success: true,
      });
    })
    .catch((err) => {
      res.status(500).json({
        err,
        message: "Failed to update order",
        success: false,
      });
    });
});

router.put("/orderdDelivered/:orderId", (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findOneAndUpdate(
    { orderId },
    { isDelivered: true, deliveryDate: moment(new Date()).format("DDMMYYYY") }
  )
    .exec()
    .then(() => {
      res.status(200).json({
        message: "Order ready to deliver.",
        success: true,
      });
    })
    .catch((err) => {
      res.status(500).json({
        err,
        message: "Failed to update delivery status",
        success: false,
      });
    });
});

router.post("/placeOrder", (req, res, next) => {
  const order = req.body;
  const newOrder = new Order({
    _id: new mongoose.Types.ObjectId(),
    orderId: uniqid.time(),
    buyerName: order.buyerName,
    address: order.address,
    pinCode: order.pinCode,
    mobile: order.mobile,
    email: order.email,
    orderDate: order.orderDate,
    isDelivered: false,
    deliveryDate: "",
    isAccepted: false,
    items: order.items,
  });

  newOrder
    .save()
    .then((item) => {
      const { transporter, mailOptions, constructMail } = mailer;
      mailOptions.html = constructMail(ORDER_CUSTOMER, order);
      mailOptions.to = order.email;
      mailOptions.subject = ORDER_SUBJECT;
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error(err)
      });
      res.status(200).json({
        message: "Order added successfully",
        success: true,
        item,
      });
    })
    .catch((err) => {
      res.status(500).json({
        err,
        message: "Failed to add order",
        success: false,
      });
    });
});

module.exports = router;
