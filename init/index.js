const mongoose = require("mongoose");
const obj = require("./data.js");
const Listing = require("../models/listing.js");


main()
 .then((res)=>{ console.log("Connection Successful")})
 .catch((err)=>{ console.log(err)})
 

async function main(params) {
    await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');
}

const init = async ()=> {
  await Listing.deleteMany({});
  await Listing.insertMany(obj.data);
  console.log("DB initialized");
}

init();
