const mongoose = require("mongoose");
const {Schema} = mongoose; // destructuring from mongoose

// const main = async(params)=>{
//     await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
// }

// main()
// .then((res)=>{console.log("Coneection Successfull.")})
// .catch((err)=>{console.log(err)})

const reviewSchema = new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

const Review = mongoose.model("Review",reviewSchema);

// const showReviews = async()=>{
//     let res = await Review.findOne({rating:5});
//     console.log(res.comment,res.rating,"\n")
// }
// showReviews()

module.exports = Review;
