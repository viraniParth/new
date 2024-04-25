const express = require("express");
const validate = require("../middlewares/validate");
const { paymentController } = require("../controllers");
const paymentValidation  = require("../validation/payment.validate");
const { authenticate, restrict } = require("../middlewares/auth");
const route = express.Router();

route.get("/get", authenticate, restrict(["admin"]), paymentController.getPayment);
route.post("/add", validate(paymentValidation.addPayment), paymentController.addPayment);
route.put(
  "/update/:id",
  validate(paymentValidation.addPayment),
  paymentController.updatePayment
);
route.delete(
  "/delete/:id",
  paymentController.deletePayment
);

module.exports = route;
