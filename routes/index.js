var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

// root route
router.get("/", function(req, res){
    res.render("homePage");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

// handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username, online:false});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to the Chat Menu " + user.username);
            res.redirect("/chatMenu");
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate('local', 
    { 
        successRedirect: '/chatMenu',
        successFlash: 'Welcome!',
        failureRedirect: '/login',
        failureFlash: true 
    }
));

// logout route
router.get("/logout", function(req, res){
    // TODO:
        // Can be improved using the user session to set online to false 
        // without the need of pressing "Log out"
    User.findById(req.user._id, function (err, foundUser) {
        foundUser.online = false;
        foundUser.save();
    });        
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
});

module.exports = router;