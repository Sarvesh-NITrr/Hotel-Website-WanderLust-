// require("dotenv").config()
console.log("🔥 THIS INDEX.JS IS RUNNING 🔥");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const Listing = require("./models/listing");
const Review = require("./models/review");
const app = express();
// const expressLayouts = require("express-ejs-layouts");
const ejsMate = require("ejs-mate");
const methodOverriding = require("method-override")
const wrapAsync = require("./utils/wrapAsync");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js")
app.use(methodOverriding("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
// app.use(expressLayouts);
// app.set("layout","layouts/boilerplate");
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);

main()
 .then((res)=>{ console.log("Connection Successful")})
 .catch((err)=>{ console.log(err)})
 

async function main(params) {
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
}

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg);
    }
    else next();
}

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg);
    }
    else next();
}

app.get("/",wrapAsync(async(req,res)=>{
    console.log("Home route")
    res.redirect("/list")
}));
// ALL LISTINGS
app.get("/list", wrapAsync(async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("listing/index.ejs",{allListing});
}))
//

// ADD NEW LISTING
app.get("/list/new", wrapAsync(async(req,res)=>{ 
    res.render("listing/add.ejs");
}));

app.post("/list",validateListing,wrapAsync(async(req,res,next)=>{
    await Listing.insertOne(req.body);
    res.redirect("/list")
}));

// SHOW ONE LISTING
app.get("/list/:id", wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const prop = await Listing.findById(id).populate("reviews");// only id nhi full rev obj print hoga
    res.render("listing/show.ejs",{prop});
}));

// EDIT ROUTE
app.get("/list/:id/edit", wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const obj = await Listing.findById(id);
    res.render("listing/edit.ejs",{obj});
}));

// UPDATE
app.put("/list/:id",validateListing, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body});
    res.redirect(`/list/${id}`);
}));

// DELETE 
app.delete("/list/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    res.redirect("/list");
}));

// REVIEWS ROUTES
// post
app.post("/list/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id);
    let review = await Review.insertOne(req.body.review);
    if(review) listing.reviews.push(review);
    await listing.save();
    console.log("Listing\n",listing)
    res.redirect(`/list/${id}`)
}));

//DELETE Review
app.delete("/list/:id/reviews/:reviewId", wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/list/${id}`);
}));

app.all(/.*/,(req,res,next)=>{
    throw new ExpressError(404,"Page Not Found!!");
});

// ERROR HANDLING MIDDLEWARE
app.use((err,req,res,next)=>{
    const { status = 500 } = err;
    if (!err.message) err.message = "Something went wrong";
    res.status(status).render("error.ejs",{err});
});

//LISTENING
// const PORT = process.env.PORT;
app.listen(3000,()=>{
    console.log(`Server is listening @Port`);
});

