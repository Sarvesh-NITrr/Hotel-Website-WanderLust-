const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const router = express.Router();
const { saveRedirectUrl } = require("../middlewares.js");
const userController = require('../controllers/user.js')
// router.use(cookieParser());

// router.route collects same route req (with diff http verbs (get,post,...)) together
router.route('/signup')
 .get(wrapAsync(userController.renderSignupForm))
 .post(wrapAsync(userController.signUp))

router.route("/login")
  .get(wrapAsync(userController.renderLoginForm))
  .post(
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),
    wrapAsync(userController.logIn)
  )

router.get("/logout",wrapAsync(userController.logOut))

module.exports = router;