const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const cookieParser = require("cookie-parser");
const router = express.Router();
const {isLoggedIn,isOwner,validateListing} = require('../middlewares.js')
router.use(cookieParser());
const listingController = require('../controllers/listing.js')

// collects same route reqs together
router.route("/")
 .get(wrapAsync(listingController.index))
 .post(isLoggedIn,validateListing,wrapAsync(listingController.insertNewListing)) // POST NEW LISTING


router.route("/:id")
 .get(wrapAsync(listingController.showListing)) 
 .put(isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing))
 .delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing)) // DELETE

// ADD NEW LISTING PAGE
router.get("/new", isLoggedIn, wrapAsync(listingController.addListingForm)) 

// EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListingPage))

module.exports = router