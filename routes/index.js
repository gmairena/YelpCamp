var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//ROOT ROUTE
router.get("/",function(req,res){
	res.render("landing");
});


//===================
// AUTHENTICATION ROUTES
//===================

//show register form
router.get("/register",function(req,res){
	res.render("register");
});
//handle sign up logic
router.post("/register", function(req, res){
	//create user object, save user, and hash passwork seperately
    var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render('register');
        }
		//the line bellow will log the user in, store info, run serialize method, using "local" strategy
        passport.authenticate("local")(req, res, function(){
            req.flash("Success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
        });
    });
});

// LOGIN ROUTES
//render login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//login logic
//middleware
router.post("/login", passport.authenticate("local", 
	{
    	successRedirect: "/campgrounds",
    	failureRedirect: "/login"
	}) ,function(req, res){
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
	req.flash("success", "Logged You Out!");
    res.redirect("/campgrounds");
});



module.exports = router;
