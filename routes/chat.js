var express = require("express");
var router  = express.Router();
var middleware = require("../middlewares");
var User = require("../models/user");
var Chat = require("../models/chat");

//INDEX - show chat menu
router.get("/", [middleware.isLoggedIn, middleware.setOnline], function(req, res){  
    // Search all Chats of user
    Chat.find({}, function(err, allChats){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/chat");
        } else {
            // Search all Users
            User.find({}, function(err, allUsers){
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("/chat");
                } else {
                    res.render("chat",{chats:allChats, users:allUsers});
                }
            });            
        }
    });    
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    User.find({}, function(err, allUsers){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/chat");
        } else {
            res.render("chat/new",{users:allUsers});
        }
    });
});

//CREATE - add new campground to DB 
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var date = mm + '/' + dd + '/' + yyyy;

    var mem1 = {
        id: req.user._id,
        username: req.user.username
    }
    var name2 = req.body.mem2;
    User.findOne({username:name2}).exec(function (err, user2) {
        if(err){
            req.flash("error", "User does not exists");
            return res.redirect("/chat");
        } else {
            mem2 = {id:user2._id, username:user2.username}
            var newChat = {creationDate:date, member1:mem1, member2:mem2}
            // Create a new chat and save to DB
            Chat.create(newChat, function(err, newlyCreated){
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("/chat");
                } else {
                    res.redirect("/chat");
                }
            });
        }
    });
});

// SHOW - shows more info about one campground
router.get("/:id", middleware.checkChatOwnership, function(req, res){
    //find the campground with provided ID
    // .populate("attributeName") allows you to have access to the object attributes
    // and not just the ObjectId itself
    Chat.findById(req.params.id).populate("messages").exec(function(err, foundChat){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("chat/show", {chat: foundChat});
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkChatOwnership, function(req, res){
    Chat.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/chat");
        } else {
            res.redirect("/chat");
        }
    });
});

module.exports = router;