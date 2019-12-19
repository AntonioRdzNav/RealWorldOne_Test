var mongoose = require("mongoose");

var chatSchema = new mongoose.Schema({
   creationDate: String,
   member1: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   member2: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   messages: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Message"
      }
   ]
});

module.exports = mongoose.model("Chat", chatSchema);