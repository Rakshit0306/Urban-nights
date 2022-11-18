var express = require("express");
var router  = express.Router();
var Night   = require("../models/night");

var middleware = require("../middleware/index")


router.get("/stories", function(req, res){
    Night.find({}, function(err, night){
        
        if(err){
            console.log(err);
        }
        else{
            res.render("nightmares/index", {stories: night});
        }
    })
})



router.get("/stories/new",middleware.isLoggedIn, function(req, res){
    res.render("nightmares/new");
})

router.post("/stories",middleware.isLoggedIn, function(req, res){
  

    req.body.story.body = req.sanitize(req.body.story.body);
    Night.create(req.body.story, function(err, newStory){
        newStory.author.id = req.user._id;
        newStory.author.username = req.user.username;
        newStory.save();
        if(err){
            res.render("nightmares/new");
        }
        else{
            res.redirect("/stories");
        }
    })
})

router.get("/stories/:id", function(req, res){
    Night.findById(req.params.id).populate("comments").exec( function(err, foundStory){
        
        if(err){
            res.redirect("/stories");
        }
        else{
            res.render("nightmares/show", {story: foundStory});
        }
    })
})

router.get("/stories/:id/edit", middleware.checkStoryUser, function(req, res){

        Night.findById(req.params.id, function(err, foundStory){
            res.render("nightmares/edit", {story: foundStory});
            
        })
    
})
router.put("/stories/:id",middleware.checkStoryUser, function(req, res){
    req.body.story.body = req.sanitize(req.body.story.body);
    Night.findByIdAndUpdate(req.params.id, req.body.story, function(err, updateStory){
        if(err){
            res.redirect("/stories");
        }
        else{
            res.redirect("/stories/"+req.params.id);
        }
    })
})

router.delete("/stories/:id",middleware.checkStoryUser, function(req,res){
    //destroy story
    Night.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/stories");
        }
        else{
            res.redirect("/stories");
        }
    })
})





module.exports = router;