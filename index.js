if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path")
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override");
// Require passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user")
//require Flash
const flash = require("connect-flash")
//route modules //
const campgrounds = require("./routes/campgrounds")
const reviews = require("./routes/reviews")
const userRoutes = require("./routes/users");
//require utilities/Helpers //
const AppError = require("./utilities/AppError")
const { resourceUsage } = require("process");
const {campgroundSchema , reviewSchema} = require("./schemas.js")
const helmet = require("helmet");

//sanitize mongo//
const mongoSanitize = require('express-mongo-sanitize');
//Require Session
const session = require("express-session")
const MongoDBStore = require("connect-mongo")(session);

//db cloud atlas//

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/YelpCamp"
 
//connect to mongo database
mongoose.connect(dbUrl, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
})

//Database Error Handling
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();


//middlewares//
app.engine("ejs", ejsMate) 
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true})); //parses the req body in the res.send route
app.use(methodOverride("_method")) //put and path requests
//joining public folder
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());


const secret = process.env.SECRET || 'sessionsecret';

const store = new MongoDBStore ({
    url: dbUrl,
    secret,
    touchAfter: 24* 60 * 60 // sets a refresh time, unnecessary saves every time a user refreshes the page. 
});

store.on("error", function (e) {
    console.log("Session store error", e)
})

//sanitize initiate


const sessionConfig = {
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,  //1000 ms x 60 sec x 60 m x 24 hr x 7 days  - to calculate ms in 7 days//
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

//Use Session and Flash // 
app.use(session(sessionConfig))
app.use(flash())
app.use(helmet());

//content security policy //
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/drej1gfby/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// PASSPORT initialize - make sure passport session is after app session
app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));

// How to store and unstore passwords in sessions
passport.serializeUser(User.serializeUser()) ; 
passport.deserializeUser(User.deserializeUser()) ; 

app.use((req, res, next) => {
    // if (!["/login","/"].includes(req.originalUrl)) {
    //     req.session.returnTo = req.originalUrl;
    // }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

//use routes handlers//
app.use("/campgrounds", campgrounds)
app.use("/campgrounds/:id/reviews", reviews)
app.use(express.static("public"))
app.use("/", userRoutes)


//ROUTES

//Home route//
app.get("/", (req, res) => {
    res.render("home")
})

// Broken url - for every request, will only run if all above routes didnt match. 
app.all("*", (req, res, next) => {
    next(new AppError("Page not found", 404))
}) 

//Error Handling Route //
app.use((err, req, res, next) => {
    const {statusCode = 500} = err; 
    if (!err.message) err.message = "Oh no, Something went wrong"
    res.status(statusCode).render("error", { err });
})

//Open port route

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})




//moved to routes files
// const wrapAsync = require("./utilities/wrapAsync") 

//require campground model - moved to separate param file//
// const Campground = require("./models/campground");
// const Product = require("../Section38_Mongoose_Express/models/product");