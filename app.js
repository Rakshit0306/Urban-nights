var express    = require("express"),
bodyParser     = require("body-parser"),
mongoose       = require("mongoose"),
app            = express(),
methodOverride = require("method-override"),
expSan         = require("express-sanitizer"),
passport       = require("passport"),
localStrategy  = require("passport-local"),
flash          = require("connect-flash"),
User           = require("./models/user");

var compression = require('compression');
app.use(compression());



var storyRoutes     =  require("./routes/stories"),
    commentRoutes   =  require("./routes/comments"),
    indexRoutes     =  require("./routes/index");

    var url = process.env.DATABASEURL;

mongoose.connect("mongodb+srv://mmaj007:Mmamarsh007@urbannightmare-b2onr.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expSan());
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();


//  PASSPORT CONFIGURATION //
app.use(require("express-session")({
    secret: "Nightmares Are Real!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(storyRoutes);




const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNNING..");
});

