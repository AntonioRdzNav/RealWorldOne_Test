var mongoose = require("mongoose");

var messageSchema = mongoose.Schema({
    text: String,
    sentiment: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Message", messageSchema);