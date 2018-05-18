var express     = require("express");
var    app         = express();
var    bodyParser  = require("body-parser");
var    mongoose    = require("mongoose");
var    Campground  = require("./models/campground");
var    seedDB      = require("./seeds");
var    Comment     = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var User = require("./models/user");
var flash = require("connect-flash");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

app.locals.moment = require('moment');
// PASSPORT CONFIGURATION FOR AUTHORIZATION
app.use(require("express-session")({
    secret: "Ellie is a very cute puppy dog.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error =  req.flash("error");
   res.locals.success =  req.flash("success");
   next();
});




// requiring routes first arg is the prefix to be added to individual route files
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   
   console.log("Yelcamp server has started!");
    
});