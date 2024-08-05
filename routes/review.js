const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/WrapAsync.js");
const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js")
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
 

const reviewController = require("../controller/reviews.js");

//reviews route
router.post("/", isLoggedIn, validateReview,wrapAsync(reviewController.createReview));
 
 
 //delete review route
 router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));


 module.exports = router;