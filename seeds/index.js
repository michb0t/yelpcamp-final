//run this file on its own separate to the node app. anytime we want to seed our database. Only anytime we make changes to our schema model.


const mongoose = require("mongoose")
const Campground = require("../models/campground");
const cities = require("./cities")
const {places, descriptors} = require("./seedHelpers")

//connect to mongo database
mongoose.connect("mongodb://localhost:27017/YelpCamp", {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})

//database error handling
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20);
        const camp = new Campground({
            //should be your user id
            author: "616d61b831c938dd36f5b5c0",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: "Point", 
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ] 
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iure possimus, sit itaque doloremque provident ullam mollitia ex ad delectus rem nostrum saepe labore culpa, eligendi qui voluptatibus! Mollitia, quod fuga!",
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/drej1gfby/image/upload/v1634703937/YelpCamp/campground2_n65dfu.jpg',
                  filename: 'YelpCamp/campground2_n65dfu',
                },
                {
                  url: 'https://res.cloudinary.com/drej1gfby/image/upload/v1634703937/YelpCamp/campground1_rew6oe.jpg',
                  filename: 'YelpCamp/campground1_rew6oe',
                }
              ],
            
        })
        await camp.save();
    }
}

//close database connection - returns a promis ebecause its an asycn function
seedDB().then(() => {
    mongoose.connection.close();
})

//pick rnadom element form an array
// array[Math.floor(Math.random() * array.length)];
