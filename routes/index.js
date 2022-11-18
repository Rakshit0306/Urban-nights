var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");

router.get("/", function(req, res){
    res.redirect("/stories");
})


//  ==================
//     AUTH ROUTES
//  ==================

router.get("/signup", function(req, res){
    res.render("signup");
})

router.post("/signup", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("signup");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "WELCOME " + user.username + ", TO DARK WORLD OF NIGHTMARES!!");
            res.redirect("/stories");
        })
    })
})

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local",
     {
         successRedirect: "/stories",
         failureRedirect: "/login"
     }),function(req, res){

});

router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Logged Out, Are you scared?")
    res.redirect("/stories");
})


module.exports = router;