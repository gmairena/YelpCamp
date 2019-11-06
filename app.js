 var express               = require("express"),
	 app                   = express(),
	 bodyParser            = require("body-parser"),
	 mongoose              = require("mongoose"),
	 flash           	   = require("connect-flash"),
	 passport              = require("passport"),
	 LocalStrategy         = require("passport-local"),
	 methodOverride        = require("method-override"),
     passportLocalMongoose = require("passport-local-mongoose"),
	 Campground            = require("./models/campground"),
	 seedDB                = require("./seeds"),
     Comment               = require("./models/comment"),
     User                  = require("./models/user");

//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method")); //_method is what it is looking for
app.use(flash());
//seed database
//seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Once again Frank wins cutest dog!",
	esave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());//these two lines insure passport works in our application
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());  //responsible for taking decoded data and encoding it and putting back into session
passport.deserializeUser(User.deserializeUser()); //responsible for reading edcoded data and decoding it

//passes current user status function on all routes
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//this method bellow allows for short hand calling urls in route files
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("YelpCamp Server has started!");
});
