var User = require("../models/user");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        User.findById(req.user._id, function (err, foundUser) {
            foundUser.online = true;
            foundUser.save();
        })
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;