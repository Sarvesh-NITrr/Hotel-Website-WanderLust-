const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const Listing = require("./models/listing");
const app = express();
// const expressLayouts = require("express-ejs-layouts");
const ejsMate = require("ejs-mate");
const methodOverriding = require("method-override")
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
    await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');
}


//
app.get("/",(req,res)=>{
    console.log("Home route")
    res.redirect("/list")
})
// ALL LISTINGS
app.get("/list", async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("listing/index.ejs",{allListing});
})
//

// ADD NEW LISTING
app.get("/list/new", (req,res)=>{
    res.render("listing/add.ejs");
})

app.post("/list",async(req,res)=>{
    const prop = await Listing.insertOne(req.body);
    res.redirect("/list")
})

// SHOW ONE LISTING
app.get("/list/:id", async(req,res)=>{
    const {id} = req.params;
    const prop = await Listing.findById(id);
    res.render("listing/show.ejs",{prop});
})

// EDIT ROUTE
app.get("/list/:id/edit", async(req,res)=>{
    const {id} = req.params;
    const obj = await Listing.findById(id);
    res.render("listing/edit.ejs",{obj});
})

// UPDATE
app.put("/list/:id", async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body});
    res.redirect(`/list/${id}`);
})

// DELETE 
app.delete("/list/:id", async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/list");
})

//LISTENING
app.listen(3000,()=>{
    console.log("Server is listening @Port 3000");
}); 