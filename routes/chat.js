var express = require("express");
var router  = express.Router();
var middleware = require("../middlewares");
var User = require("../models/user");

//INDEX - show chat
router.get("/", middleware.isLoggedIn, function(req, res){  
    // Display all LoggedIn users
    User.find({}, function(err, allUsers){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/chat");
        } else {
            res.render("chat",{users:allUsers});
        }
    });
});

module.exports = router;