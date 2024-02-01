//app.js
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const express = require("express");
const app = express();
const port = 3000;
const User = require('./models/user')
const sequelize = require('./config/db');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const initializePassport = require('./config/passport')
const methodOverride = require('method-override')
app.use(express.json());
const conciergeRoutes = require('./api/concierges')
const bellboyRoutes = require('./api/bellboys')
const reservationRoutes = require('./api/reservations')

//function for getting user,via username
async function getUserByUsername(username){
  try{
    const user = await User.findByUsername(username)
    return user
  }catch(error){
    console.error('Error fetching user by username:', error)
    return null
  }
}

//function for getting user,via id
async function getUserById(id){
  try{
    const user = await User.findById(id)
    return user
  }catch(e){
    console.error('Error fetching user by id:', e)
    return null
  }
}

//function for checking if authenticated
function checkIfAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }

  res.redirect('/login')
}

// function to check if the user has the required role
function checkUserRole(role) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    }

    // Redirect to a suitable page based on the user's role
    switch (req.user.role) {
      case 'admin':
        res.redirect('/admin');
        break;
      case 'concierge':
        res.redirect('/concierge');
        break;
      case 'bellboy':
        res.redirect('/bellboy');
        break;
      default:
        res.redirect('/');
    }
  };
}

//initalizing the user
initializePassport (
  passport ,
  username => getUserByUsername(username),
  id => getUserById(id)
)

app.use('/public', express.static('public'));
app.set('views', __dirname + '/views');
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method')) //for form method override,its for logout


app.get("/", function (req, res) {
  res.redirect('/login')
});

app.get('/login', (req,res) => {
  res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true,
}));

app.get('/dashboard', checkIfAuthenticated, (req, res) => {
  const role = req.user ? req.user.role : null;

  switch (role) {
    case 'admin':
      res.redirect('/admin');
      break;
    case 'concierge':
      res.redirect('/concierge');
      break;
    case 'bellboy':
      res.redirect('/bellboy');
      break;
    default:
      res.redirect('/index');
  }
});

app.get('/admin', checkIfAuthenticated, checkUserRole('admin'), (req,res) => {
  res.render('admin.ejs')
})

app.get('/concierge', checkIfAuthenticated, checkUserRole('concierge'), (req,res) => {
  res.render('concierge.ejs')
})

app.get('/bellboy', checkIfAuthenticated, checkUserRole('bellboy'), (req,res) => {
  res.render('bellboy.ejs')
})

app.get('/index', (req,res) => {
  res.render('index.ejs')
})

app.use('/concierges',conciergeRoutes)
app.use('/bellboys',bellboyRoutes)
app.use('/reservations',reservationRoutes)

app.delete('/logout',(req,res) => {
  req.logOut()
  res.redirect('/login')
})

app.get('/users', async (req, res) => {
  try {
    // Fetch all users from the User model
    const users = await User.findAll();

    // Send the users as JSON response
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, function () {
  console.log(`The site is on : http://127.0.0.1:${port}`);
});