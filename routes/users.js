const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync");
const passport = require("passport")
const users = require("../controllers/users")


router.route("/register")
    .get(users.renderRegister)
    .post(wrapAsync(users.register));

//login route
router.route("/login")
    .get(users.renderLogin)
    .post(passport.authenticate("local", {
    failureFlash: true, 
    failureRedirect: "/login"
}), users.login)

// logout 
router.get("/logout", users.logout)


module.exports = router;