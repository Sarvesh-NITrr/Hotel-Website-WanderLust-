// require("dotenv").config()
// const expressLayouts = require("express-ejs-layouts");
// app.use(expressLayouts);
// app.set("layout","layouts/boilerplate");
console.log("🔥 THIS INDEX.JS IS RUNNING 🔥");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const app = express();
const ejsMate = require("ejs-mate");
const methodOverriding = require("method-override")
const ExpressError = require("./utils/ExpressError.js")
app.use(methodOverriding("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);

main()
 .then((res)=>{ console.log("Connection Successful")})
 .catch((err)=>{ console.log(err)})
 

async function main(params) {
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
}

const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");

const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require('express-session');
const sessionOptions = {
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000, //time in ms 1 week
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    },
}

const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user.js");

app.use(cookieParser());
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.deleteMsg = req.flash("deleteMsg");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next()
})


app.use("/list",listingRoutes);
app.use("/list/:id/reviews",reviewRoutes);
app.use("/",userRoutes);

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

