const express         = require('express');
const router          = express.Router();
const User            = require('../models/User')
const passport        = require('passport')
const jwt             = require('jsonwebtoken')
const config          = require('config')

var multer          = require('multer')
var crypto          = require('crypto')
var path            = require('path');


var storage = multer.diskStorage({
  destination: './public/uploads/users/',
  filename: function (req, file, cb) {
    crypto.randomBytes(16, function (err, raw) {
      if (err) return cb(err)
      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})
var upload = multer({ storage: storage })

// Get register form
router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'})
})

// Register new user
router.post('/register', upload.single('his_avatar'), function(req, res, next) {
  // Create a new user from the front end data
  let newUser = new User({
    name: req.body.his_name,
    email: req.body.his_email,
    username: req.body.username,
    password: req.body.password_2,
    url: req.body.his_link,
    avatar: req.file,
    messages: []
  })

  // Save the new user
  User.addUser(newUser, (err, user) => {
    if(err){
      res.redirect('register')
    }else{
      req.session.id = user._id
      res.redirect('/user/profile/'+user._id)
      // console.log(req.session)
    }
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
        res.redirect('/user/profile/'+user._id)

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
