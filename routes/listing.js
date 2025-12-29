const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const cookieParser = require("cookie-parser");
const router = express.Router();
const {isLoggedIn,isOwner,validateListing} = require('../middlewares.js')
router.use(cookieParser());


// ALL LISTINGS
router.get("/", wrapAsync(async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("listing/index.ejs",{allListing});
}))
//

// ADD NEW LISTING
router.get("/new", isLoggedIn, wrapAsync(async(req,res)=>{
        res.render('listing/add.ejs')
}));

router.post("/",isLoggedIn,validateListing,wrapAsync(async(req,res,next)=>{
    req.body.listing.owner = req.user._id;
    await Listing.insertOne(req.body.listing);
    req.flash("success","New Listing Added!")
    res.redirect("/list")
}));

// SHOW ONE LISTING
router.get("/:id", wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const prop = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{        // nested populate ( listing ke reviews ke author ko show karo)
            path:"author",
        }
    }).populate("owner");// only id nhi full rev obj show hoga
    if(!prop){
        req.flash("error","Listing doesn't exist");
        res.redirect("/list");
    }
    else
        res.render("listing/show.ejs",{prop});
}));

// EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const obj = await Listing.findById(id);
    if(!obj){
        req.flash("error","Listing doesn't exist");
        res.redirect("/list");
    }
    else
        res.render("listing/edit.ejs",{obj});
}));

// UPDATE
router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    console.log(id);
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!")
    res.redirect(`/list/${id}`);
}));

// DELETE 
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id); 
    res.redirect("/list");
}));

module.exports = router;