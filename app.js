const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodoverride = require('method-override');
const ejsmate = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const passport=require('passport')
const localStrategy=require('passport-local')
const expressError=require('./utils/expressError')

const Campground = require('./models/campground');
const Reviews = require('./models/reviews');
const User=require('./models/users')

const campgroundRoutes = require('./routes/campgroundRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes=require('./routes/userRoutes')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-final').then(() => {
  console.log('Database connected successfully..');
}).catch(() => {
  console.log('Database connection error');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodoverride('_method'));
app.engine('ejs', ejsmate);

const sessionConfig = {
  secret: 'demosecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7
  }
};

app.use(session(sessionConfig));
app.use(flash());





// passports code

app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport ends
app.use((req, res, next) => {
  res.locals.currentUser=req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// app.get('/', (req, res) => {
//   res.render('home');
// });

app.get('/', (req, res) => {
  res.redirect('/campgrounds');
});


app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/',userRoutes);

app.all('*', (req, res, next) => {
  next(new expressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 404, message = "something went wrong" } = err;
  res.status(statusCode).render('campgrounds/errorTempelate', { statusCode, message });
});

app.listen(3000, () => {
  console.log('Server running on 3000...');
});
