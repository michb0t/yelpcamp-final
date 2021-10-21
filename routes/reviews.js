const express = require("express")
const router = express.Router({mergeParams: true});
const reviews = require("../controllers/reviews")
const wrapAsync = require("../utilities/wrapAsync")

// Middlewares //
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware")

//Reviews route //
router.post("/", 
    isLoggedIn, 
    validateReview, 
    wrapAsync(reviews.addReview));

//delete review //
router.delete("/:reviewId", 
    isLoggedIn, 
    isReviewAuthor, 
    wrapAsync(reviews.destroyReview))

module.exports = router;
