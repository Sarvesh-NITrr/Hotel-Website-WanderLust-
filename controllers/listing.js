const Listing = require("../models/listing");

module.exports.index = async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("listing/index.ejs",{allListing});
}

module.exports.addListingForm = async(req,res)=>{
        res.render('listing/add.ejs')
};

module.exports.showListing = async(req,res)=>{
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
}

module.exports.editListingPage = async(req,res)=>{
    const {id} = req.params;
    const obj = await Listing.findById(id);
    if(!obj){
        req.flash("error","Listing doesn't exist");
        res.redirect("/list");
    }
    else
        res.render("listing/edit.ejs",{obj});
}

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    console.log(id);
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!")
    res.redirect(`/list/${id}`);
}

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id); 
    res.redirect("/list");
}

module.exports.insertNewListing = async(req,res,next)=>{
    req.body.listing.owner = req.user._id;
    await Listing.insertOne(req.body.listing);
    req.flash("success","New Listing Added!")
    res.redirect("/list")
}