var express = require("express");
var router  = express.Router();

var Night   = require("../models/night");
var Comment = require("../models/comment");

var middleware = require("../middleware/index")



// ==============================
//       COMMENTS ROUTES
// ==============================


router.get("/stories/:id/comments/new", middleware.isLoggedIn,  function(req, res){
    Night.findById(req.params.id, function(err, foundStory){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", { story: foundStory });
        }
    })
})

router.post("/stories/:id/comments",middleware.isLoggedIn, function(req, res){
    Night.findById(req.params.id, function(err, night){
        if(err){
            console.log(err);
            res.redirect("/stories");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "SOMETHING WENT WRONG!!");
                    console.log(err);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    // add username and id to comment and save it
                    night.comments.push(comment);
                    night.save();
                    req.flash("success", "Message Delivered To Devil, Comment added!!");
                    res.redirect("/stories/" + night._id);
                }
            })
        }
    })
})

// comments edit route

router.get("/stories/:id/comments/:comment_id/edit",middleware.checkCommentUser, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {story_id: req.params.id, comment: foundComment});
        }
    })

})

// commments update route

router.put("/stories/:id/comments/:comment_id",middleware.checkCommentUser, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/stories/" + req.params.id);
        }
    })
})

// COMMENT DESTROY ROUTE
router.delete("/stories/:id/comments/:comment_id",middleware.checkCommentUser, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Devil has teared your message apart, Comment Deleted!!");
            res.redirect("/stories/" + req.params.id);
        }
    })
})





module.exports = router;