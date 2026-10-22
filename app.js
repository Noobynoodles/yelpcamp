if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
} //have access to the env file because of this line

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schema.js')
const Campground = require('./models/campground');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');


const usersRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl)

const db = mongoose.connection;
const { MongoStore } = require('connect-mongo');

db.on('error', console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Database Connected");
})

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize())

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());
// app.use(helmet());

const scriptSrcUrls = [
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com"
];

const styleSrcUrls = [
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com"
];

const connectSrcUrls = [
    "https://api.maptiler.com",
    "https://*.maptiler.com"
];

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            connectSrc: ["'self'", ...connectSrcUrls],
            imgSrc: [
                "'self'",
                "data:",
                "blob:",
                "https://*.maptiler.com",
                "https://res.cloudinary.com",
                "https://images.unsplash.com"
            ],
            fontSrc: ["'self'", "data:", "https://cdn.maptiler.com"],
            workerSrc: ["'self'", "blob:"],
            objectSrc: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function (req, res, next) {
    //console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.get('/fakeUser', async function (req, res) {
//     const user = new User({ email: 'colttttt@gmail.com', username: 'Colttt' })
//     const newUser = await User.register(user, 'chicken');
//     res.send(newUser);
// })

app.use('/', usersRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', function (req, res) {
    res.render('home')
})

app.all('/{*path}', function (req, res, next) {
    next(new ExpressError('Page Not Found', 404))
})

app.use(function (err, req, res, next) {
    const { statusCode = 404 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err }); // rendering the error.ejs file
})

// app.use(function (err, req, res, next) {
//     res.send('Oh boy, something went wrong!')
// })

// app.get('/makecampground', async function (req, res) {
//     const camp = new Campground({
//         title: 'My Backyard',
//         description: 'Cheap Camping'
//     })
//     await camp.save();
//     res.send(camp);
// })

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
});