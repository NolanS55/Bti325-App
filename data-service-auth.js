var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var schema = mongoose.Schema

var userSchema = new schema ({
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime": Date,
        "userAgent": String
    }]
})
let user

module.exports. initialize = function() {
    return new Promise((resolve, reject)=> {
        const database = mongoose.createConnection("mongodb+srv://nolan4smith:e9PXIDWl8AhRyHZx@test4school.yyakkxq.mongodb.net/bti")
        database.on('error', err => {
            reject(err)
        })

        database.once('open', () => {
            user = database.model("users", userSchema)
            resolve()
        })
        
    })
}

module.exports. registerUser = function(userData) {
    return new Promise((resolve, reject)=> {
        if(userData.password == "") {
            reject("Error: password can not only be whitespaces")
        }
        if(userData.password != userData.password2) {
            reject("Error: passwords do not match")
        }
        bcrypt.hash(userData.password, 10).then((hash) => {
            let newUser = new user({
                userName: userData.userName,
                password: hash,
                email: userData.email,
                loginHistory: [{
                    dateTime: new Date().toString(),
                    userAgent: userData.userAgent
                }]
            })
            newUser.save().then(() => {
                resolve()
            }).catch((err) => {
                if(err.code = 11000) {
                    reject("UserName Already Taken")
                }
                else {
                    reject("There was an error creating user")
                }
            })
        }).catch(() => {
            reject("There was an error Hashing the password")
        })
       
    })
    
}

module.exports. checkUser = function(userData) {
    return new Promise((resolve, reject)=> {
        user.findOne({ userName : userData.userName }).exec().then((User) => {
            if(User == {}) {
                reject("Unable to find:" + userData.userName)
            }
            
            bcrypt.compare(userData.password, User.password).then((res) => {
                if(!res) {
                    reject("Passwords do not match")
                }
            }).catch((err) => {
                reject("Error validating passwords")
            })

            User.loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent})

            user.updateOne({userName: User.userName},{ $set : {loginHistory: User.loginHistory}}).exec().then(() => {
                resolve(User)
            }).catch((err) => {
                reject("There was an error verifying the user:"+ err)
            })
        }).catch(()=> {
            reject("Unable to find user:" + userData.userName)
        })
    })
}

