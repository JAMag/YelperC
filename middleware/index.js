var Campground = require("../models/campground");
var Comment = require("../models/comment");

//all middleware goes here
var middlewareObj = {};


// Check the ownership of the Campground for authorization
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            }  else {
                //does user own campground?
                if(foundCampground.author.id.equals(req.user.id)) {
                   next();
                } else {
                    req.flash("error", "You don't have authorization to do that.");
                    res.redirect("back");
                }
            }
    });
    } else {
        req.flash("error", "You need to be logged in to do that!!");
        res.redirect("back");
    }
}


// Check the ownership of the Comment for authorization
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }  else {
                //does user own comment?
                if(foundComment.author.id.equals(req.user._id)) {
                   next();
                } else {
                    res.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
    });
    } else {
        res.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}


// Make sure there is a user loged in
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!!");
    res.redirect("/login");
}


module.exports = middlewareObj;