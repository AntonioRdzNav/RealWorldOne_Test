// require NPM frameworks
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    User            = require("./models/user");

//requiring routes
var indexRoutes      = require("./routes/index"),
    chatMenuRoutes   = require("./routes/chat"),
    messageRoutes    = require("./routes/messages");
    // videoServer    = require("./public/videoServer");

// Connect to online mongoDB Server
mongoose.connect("mongodb+srv://RealWorldOne_Test:Lucamigo%2F%409856@cluster0-prhko.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("Connected to Mongoose DB");
}).catch(err => {
    console.log("ERROR: ", err.message);
});
// standard setup
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "This message is used to hash all passwords",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set "global" requests
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


app.use("/", indexRoutes);
app.use("/chat", chatMenuRoutes);
app.use("/chat/:id/messages", messageRoutes);
// app.use(videoServer);
app.get('*', function(req, res) {
    res.redirect('/');
});


// set connection
PORT = 3000
app.listen(PORT, function(){
   console.log("The Server Has Started!");
});

