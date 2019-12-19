var express = require("express");
var router  = express.Router();
var middleware = require("../middlewares");

//INDEX - show chat
router.get("/", middleware.isLoggedIn, function(req, res){
    // will display all chats
    res.render("chat");
});

module.exports = router;