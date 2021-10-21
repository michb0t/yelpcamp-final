const {campgroundSchema , reviewSchema} = require("./schemas.js");
const AppError = require("./utilities/AppError");
const Campground = require("./models/campground");
const Review = require("./models/review")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You are currently not logged in");
        return res.redirect("/login")
    }
    next();
}

module.exports.validateCamp = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el=>el.message).join(",")
        throw new AppError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async(req,res,next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash("error", "You do not have permission to edit")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to edit")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}


module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body) //check for errors
    if (error) {
        const msg = error.details.map(el=>el.message).join(",")
        throw new AppError (msg, 400)
    } else {
        next();
    }
}


