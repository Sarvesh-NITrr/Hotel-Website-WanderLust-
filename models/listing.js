const mongoose = require("mongoose");

const listingSchema = {
    title: {type:String, required:true},
    description : String,
    image:String,
        
    price: Number,
    location: String,
    country:String
};

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;