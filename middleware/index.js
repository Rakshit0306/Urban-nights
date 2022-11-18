// all middleware goes here
var Night   = require("../models/night");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkStoryUser = function checkUser(req, res, next) {
        if(req.isAuthenticated()){
            Night.findById(req.params.id, function(err, foundStory){
                if(err){
                    res.redirect("/stories");
                }
                else{
                    // does thee user own the story
                    console.log(foundStory.author.id);
                    if(foundStory.author.id.equals(req.user._id)){
                        next();
                    }else{
                        req.flash("error", "NO PERMISSION!! YOU ARE CURSED!!");
                        res.redirect("back");
                    }
                }
            })
        }else{
            req.flash("error", "Wanna come to world of Nightmares!! Login First!!");
            res.redirect("/login");
        }
    }

middlewareObj.checkCommentUser = function checkCommentUser(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("/stories");
            }
            else{
                // does user own the comment 
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "NO PERMISSION, YOU'RE CURSED!!");
                    res.redirect("back");
                }
            }
        })
    }else{
        req.flash("error", "Want your message to be delivered to the Devil, Login first!!");
        res.redirect("/login");
    }
}


middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Wanna come to world of Nightmares!! Login First!!");
    res.redirect("/login");
}


module.exports = middlewareObj;