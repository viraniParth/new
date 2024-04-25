const express = require("express");
const validate = require("../middlewares/validate");
const { authenticate, restrict } = require("../middlewares/auth");
const { userController } = require("../controllers");
const { userValidation } = require("../validation");
const route = express.Router();

route.get(
  "/profile",
  authenticate,
  restrict(["admin", "user"]),
  userController.getProfile
);
route.get("/get", authenticate, restrict(["admin"]), userController.getUser);
route.post(
  "/register",
  validate(userValidation.addUser),
  userController.addUser
);
route.post("/login", userController.loginUser);
route.post(
  "/update/:id",
  validate(userValidation.addUser),
  userController.deleteUser
);
route.delete("/delete/:id", userController.updateUser);

module.exports = route;
