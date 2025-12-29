const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {listingSchema,reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js")
const cookieParser = require("cookie-parser");

const router = express.Router();
const User = require("./../models/user.js");
const { saveRedirectUrl } = require("../middlewares.js");
// router.use(cookieParser());
// const validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(404,errMsg);
//     }
//     else next();
// }


router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        const {email,username} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,req.body.password);
        await registeredUser.save();
        req.login(registeredUser,(err)=>{
            if(err) next(err)
            else{
                req.flash("success","Registration successful & LoggedIn")
                res.redirect("/list");
            }
        })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}))

router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
})

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),
    wrapAsync(async(req,res)=>{
        req.flash("success","Welcome to WanderLust");
        res.redirect(res.locals.redirectUrl || "/list");
    })
)

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err)
        }
        else{
            req.flash("success","Logged out successfully");
            res.redirect('/list')
        }
    })
})

module.exports = router;