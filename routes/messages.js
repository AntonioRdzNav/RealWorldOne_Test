var express = require("express");
var router  = express.Router({mergeParams: true});
var Chat = require("../models/chat");
var Message = require("../models/message");
var middleware = require("../middlewares");

AYLIENTextAPI   = require('aylien_textapi');
// ALYIEN API CONFIGURATION
var textapi = new AYLIENTextAPI({
    application_id: "a4bec524",  
    application_key: "5e4f7f2c12c69cb185e52c0581901abe"
});


//Message Create
router.post("/", [middleware.isLoggedIn, middleware.checkChatOwnership],function(req, res){
   // lookup chat using ID
   Chat.findById(req.params.id, function(err, chat){
       if(err){
           req.flash("error", err.message);
           res.redirect("/chat");
       } else {
        Message.create(req.body.message, function(err, message){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
                // clasify sentiment of text
                textapi.sentiment({"text": message.text}, function(error, response) {
                    if (error === null) {
                        //add username and id to message
                        var newAuthor = {id:req.user._id, username:req.user.username}
                        message.author = newAuthor;
                        message.sentiment = response.polarity;
                        //save message
                        message.save();
                        chat.messages.push(message);
                        chat.save();
                        req.flash("success", "Successfully added message");
                        res.redirect('/chat/' + chat._id);                
                    }
                });
           }
        });
       }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:message_id", middleware.checkMessageOwnership, function(req, res){
    //findByIdAndRemove
    Message.findByIdAndRemove(req.params.message_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Message deleted");
           res.redirect("/chat/" + req.params.id);
       }
    });
});

module.exports = router;