const express = require("express");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,validateReview,isReviewAuthor} = require('../middlewares.js')
const router = express.Router({mergeParams:true}); // brings req.params (like id) from parent route, here



// REVIEWS ROUTES
// post
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);
    if(review) await review.save();
    await listing.save();
    req.flash("success","Review Added!")
    res.redirect(`/list/${id}`)
}));

//DELETE Review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("deleteMsg","Review Removed!")
    res.redirect(`/list/${id}`);
}));

module.exports = router;