const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review")

const ImageSchema = new Schema ({
            url: String,
            filename: String
});

const opts = {toJSON: { virtuals: true}};

//virtual properties
ImageSchema.virtual("thumbnail").get(function() {
    return this.url.replace("/upload", "/upload/w_150/h_150")
});

const campgroundSchema = new Schema ({
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ["Point"], //must be point
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]    
}, opts);

campgroundSchema.virtual("properties.popUpMarkup").get(function() {
    return `
        <a href="/campgrounds/${this._id}"> ${this.title} </a>
        <p>${this.description.substring(0,25)}...</p>    
    `

});

campgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

//delete all reviews where all ID fields is somewhere in our document that was just delted and in its reviews array/

module.exports = mongoose.model("Campground", campgroundSchema)