const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const config   = require('config')

const UserSchema = mongoose.Schema({
    name: {type: String, required: false},
    email: {type: String, required: true},
    password: {type: String, required: true},
    url: {type: String, required: true},
    messages: Object,
    // avatar: {type: Object, required: true, default: {}},
})

const User = module.exports = mongoose.model('User', UserSchema)

// Save a new user
module.exports.addUser = function(newUser, callback){
    bcryptjs.genSalt(10, (err, salt) =>{
        bcryptjs.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash
            newUser.save(callback)
        })
    })
}

// Get the user by id
module.exports.getUserById = function(id, callback){
    User.findById(id, callback)
}

// Get the user by username
module.exports.getUserByUsername = function(username, callback){
    const query = {username: username}
    User.findOne(query, callback)
}

// Get the user by his url
module.exports.getUserByUrl = function(url, callback){
    const query = {url: url}
    User.findOne(query, callback)
}

// Get the user by email
module.exports.getUserByEmail = function(email, callback){
    const query = {email: email}
    User.findOne(query, callback)
}

// Check password
module.exports.checkPassword = function(testPassword, hash, callback){
    bcryptjs.compare(testPassword, hash, (err, isMatch)=>{
        if(err) throw err;
        callback(null, isMatch)
    })
}