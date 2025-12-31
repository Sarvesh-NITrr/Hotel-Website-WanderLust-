const express = require("express");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,validateReview,isReviewAuthor} = require('../middlewares.js')
const router = express.Router({mergeParams:true}); // brings req.params (like id) from parent route, here
const reviewController = require('../controllers/review.js')


// REVIEWS ROUTES
// post
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.addReview));

//DELETE Review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;