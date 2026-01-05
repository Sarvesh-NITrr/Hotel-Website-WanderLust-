const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const cookieParser = require("cookie-parser");
const router = express.Router();
const {isLoggedIn,isOwner,validateListing} = require('../middlewares.js')
router.use(cookieParser());
const listingController = require('../controllers/listing.js')

const multer = require('multer')
const {storage} = require('../cloudConfig.js')
const upload = multer({storage});// to save in local system fill local path

// collects same route reqs together
router.route("/")
 .get(wrapAsync(listingController.index))
 .post(isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.insertNewListing)) // POST NEW LISTING

// ADD NEW LISTING PAGE
router.get("/new", isLoggedIn, wrapAsync(listingController.addListingForm)) 


router.route("/:id")
 .get(wrapAsync(listingController.showListing)) 
 .put(isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))
 .delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing)) // DELETE

// EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListingPage))

module.exports = router