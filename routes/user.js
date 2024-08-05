const express = require("express");
const router = express.Router();
const User = require("../Models/user.js");
const WrapAsync = require("../utils/WrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


const userController = require("../controller/users.js");

router.get("/signup", userController.renderSignUpForm);


router.post("/signup", saveRedirectUrl, WrapAsync(userController.signUp));



router.get("/login", userController.renderLoginForm);


router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}) , userController.logIn);


router.get("/logout", userController.logOut);


module.exports = router;


