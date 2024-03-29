var Campground = require("../models/campground");
var Comment = require("../models/comment");


// all middle ware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
			Campground.findById(req.params.id, function(err, foundCampground){
				if(err){
					req.flash("error", "Campground not found");
					res.redirect("back");
				} else {
					//does user own campground? If yes run code
					if(foundCampground.author.id.equals(req.user._id)){
						next();
					} else {
						req.flash("error", "You don't have permission to do that");
						res.redirect("back");
					}
				}
			});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back"); //takes user to previous page they were on
	}
}

middlewareObj.checkCommentOwnership = function (req, res, next){
	if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err){
					res.redirect("back");
				} else {
					//does user own comment? If yes run code
					if(foundComment.author.id.equals(req.user._id)){
						next();
					} else {
						req.flash("error", "You don't have permission to do that");
						res.redirect("back");
					}
				}
			});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back"); //takes user to previous page they were on
	}
}

middlewareObj.isLoggedIn = function (req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
};

module.exports = middlewareObj