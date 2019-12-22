var User = require("../models/user");
var Chat = require("../models/chat");
var Message = require("../models/message");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.setOnline = function(req, res, next){
    User.findById(req.user._id, function (err, foundUser) {
        foundUser.online = true;
        foundUser.save();
    });
    return next();
}

middlewareObj.checkChatOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Chat.findById(req.params.id, function(err, foundChat){
            if(err || foundChat==null){
                req.flash("error", "Chat not found");
                res.redirect("back");
            }  else {
                // does user own the campground?
                if(foundChat.member1.id.equals(req.user._id) || foundChat.member2.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
} 

middlewareObj.checkMessageOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Message.findById(req.params.message_id, function(err, foundMessage){
           if(err){
               res.redirect("back");
           }  else {
                // does user own the message?
                if(foundMessage.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

module.exports = middlewareObj;