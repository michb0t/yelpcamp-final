
const Campground = require("../models/campground")
const Review = require("../models/review")


module.exports.addReview = async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review) // gave each input in the form under the key "review"
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Your review has been published")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.destroyReview = async (req,res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Your review has been deleted")
    res.redirect(`/campgrounds/${id}`);
}