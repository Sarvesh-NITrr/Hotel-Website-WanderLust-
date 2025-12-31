const Listing = require('../models/listing')
const Review = require('../models/review')

module.exports.addReview = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);
    if(review) await review.save();
    await listing.save();
    req.flash("success","Review Added!")
    res.redirect(`/list/${id}`)
}

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("deleteMsg","Review Removed!")
    res.redirect(`/list/${id}`);
}