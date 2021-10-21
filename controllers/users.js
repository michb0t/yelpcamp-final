const User = require("../models/user");

//render register page 
module.exports.renderRegister =  (req, res) => {
    res.render("users/register")
}

//new user
module.exports.register = async (req,res, next)=> {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const regUser = await User.register(user, password);
        req.login(regUser, err=> {
            if (err) return next(err);
            req.flash("success", "Welcome to Yelpcamp!");
            res.redirect("/campgrounds");
        })
    }catch (e) {
        req.flash("error", e.message)
        res.redirect("/register")
    }
}

//render login page

module.exports.renderLogin = (req, res) => {
    res.render("users/login");
}
// log in a user 
module.exports.login = (req, res) => {
    req.flash("success","Welcome back");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

//log out a user
module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "Goodbye!")
    res.redirect("/campgrounds")
}