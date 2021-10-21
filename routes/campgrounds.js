const express = require("express")
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync")
const { isLoggedIn, validateCamp, isAuthor } = require("../middleware")
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const {storage} = require("../cloudinary")
const upload = multer({storage})

router.route("/")
    .get(wrapAsync(campgrounds.index))
    .post(
        isLoggedIn, 
        upload.array("image"),
        validateCamp, 
        wrapAsync(campgrounds.createCampground))

router.get("/new", isLoggedIn, campgrounds.renderNewForm)

router.route("/:id")
    .get(
        wrapAsync(campgrounds.showCampground))
    .put(
        isLoggedIn, 
        isAuthor,
        upload.array("image"), 
        validateCamp, 
        wrapAsync(campgrounds.updateCampground))
    .delete(
        isLoggedIn, 
        isAuthor,
        wrapAsync(campgrounds.destroyCampground))

//All Campgrounds Page//
//Create New Campground // 
//Step 1. Create new form (need to put this before:id routes for it to work)


//Step 2. Create post-request to complete submission
// Product Details Page //
//Step 1. Create product details page by ID

//Update Product //

//Step 1. Create form to update 
router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm));

//Step 2. Complete submission with post route

//Delete Campground//


module.exports = router;