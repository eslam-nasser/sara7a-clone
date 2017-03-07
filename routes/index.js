var express           = require('express');
var router            = express.Router();
const User            = require('../models/User')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Home'})
});

// get message box
router.get('/user/:user_link', function(req, res, next) {
  const user_link = req.params.user_link;
  console.log('USER LINK', user_link)
  User.getUserByUrl(user_link, function(err, user){
    if(!err){
      res.render('write', {
        title: 'Write a message',
        username: user.name
      })
    }else{
      throw err;
    }
  })
});


// get message box
router.post('/user/:user_link', function(req, res, next) {
  const user_link   = req.params.user_link
  const new_message = {
    content: req.body.new_message,
    sent_at: new Date()
  }
  User.findOne({url: user_link})
    .exec(function(err, user){
      if(!err){
        let messages = []
        messages.push(user.messages)
        messages.push(new_message)
        messages = flatten(messages)
        user.messages = messages
        user.save(function(){
          if (!err){
            res.render('sent')
          }
        })
      }
    })
});



// Get users data
// router.get('/profile', passport.authenticate('jwt', {session: false}), function(req, res, next) {
router.get('/user/profile/:id', function(req, res, next) {
  var siteUrl = req.protocol + '://' + req.get('host')
  console.log(req.session)
  User.getUserById(req.params.id, function(err, user){
    res.render('profile', {
      title: 'My profile',
      user: user,
      siteUrl: siteUrl
    });
  })
});




// Help to fix the messages
function flatten(arr) {  
  return arr.reduce(function(explored, toExplore) {
    return explored.concat(
      Array.isArray(toExplore)?
      flatten(toExplore) : toExplore
    );
  }, []);
}


module.exports = router;
