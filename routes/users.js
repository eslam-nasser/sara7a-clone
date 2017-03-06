const express         = require('express');
const router          = express.Router();
const User            = require('../models/User')
const passport        = require('passport')
const jwt             = require('jsonwebtoken')
const config          = require('config')


// Get register form
router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'})
})

// Register new user
router.post('/register', function(req, res, next) {
  // Create a new user from the front end data
  let newUser = new User({
    name: req.body.his_name,
    email: req.body.his_email,
    username: req.body.username,
    password: req.body.password_2,
    url: req.body.his_link,
    messages: []
  })

  // Save the new user
  User.addUser(newUser, (err, user) => {
    if(err){
      res.redirect('register')
    }else{
      // req.session.user = user
      res.redirect('profile/'+user._id)
      // console.log(req.session)
    }
  })
});


// Get users data
// router.get('/profile', passport.authenticate('jwt', {session: false}), function(req, res, next) {
router.get('/profile/:id', function(req, res, next) {
  var siteUrl = req.protocol + '://' + req.get('host')

  User.getUserById(req.params.id, function(err, user){
    res.render('profile', {
      title: 'My profile',
      user: user,
      siteUrl: siteUrl
    });
  })
});


router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'})
})


// Login
router.post('/login', function(req, res, next) {
  // Get login details
  const email = req.body.his_email,
        password = req.body.password_1;
  
  // Check if he is cool!
  User.getUserByEmail(email, (err, user)=>{
    // console.log(err)
    if(err) throw err;
    if(!user){
      return res.json({
        success: false,
        message: 'User not found!'
      })
    }

    User.checkPassword(password, user.password, (err, isMatch)=>{
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        })
        req.session.id = user._id
        res.redirect('/users/profile/'+user._id)

        // res.json({
        //   success: true,
        //   token: 'JWT '+token,
        //   user: {
        //     id: user._id,
        //     name: user.name,
        //     email: user.email
        //   }
        // })
      }else{
        res.json({
          success: false,
          message: 'Wrong password!'
        })
      }
    })
  })
});


// Logout
router.get('/logout', function(req, res){
  req.session = null;
  res.redirect('/')
})

module.exports = router;
