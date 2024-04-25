const express = require("express");
const route = express.Router();
const { orderController } = require("../controllers");
const validate = require("../middlewares/validate");
const orderValidation = require("../validation/order.validate");
const { authenticate, restrict } = require("../middlewares/auth");

route.post(
  "/add",
  validate(orderValidation.addOrder),
  orderController.addOrder
);
route.get("/get", authenticate, restrict(["admin"]), orderController.getOrder);
route.put(
  "/update/:id",
  validate(orderValidation.addOrder),
  orderController.updateorder
);
route.delete("/delete/:id", orderController.deleteorder);

module.exports = route;
