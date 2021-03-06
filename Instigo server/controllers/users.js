const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../configuration');
const Vemail = require('../models/verifyemail')
const verifyEmail = require ('./emailVerification');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require("bcryptjs");
const phone = require("phone");
const Fpass = require("../models/forgotPassword");
const decode = require('jwt-decode');
const {check, validationResult } = require('express-validator');
var randtoken = require('rand-token');
const passport = require('passport');
signToken = user => {
  return JWT.sign({
    iss: 'CodeWorkr',
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET);
}
passport.use(
  new GoogleStrategy(
    {
        clientID: "97354838466-jhq1idtmnofl2vvnnhn8dj4gi0t4ngq0.apps.googleusercontent.com",
        clientSecret: "oDN7TToVdMpqwCdhDCZEsGOI",
        callbackURL: '/auth/google/callback'
    },
    function(req, token, refreshToken, data, done) {
      process.nextTick(function() {
        User.findOne({ 'email' : data.emails[0].value }, function(err, user) {
          if (err) return done(err);

          if (user) {
              User.updateOne({'email' : data.emails[0].value }, { socialId: data.id })
              return done(null, user);
          } else {
            var newUser = {
              email: data.emails[0].value,
              socialId: data.id,
              password:'$2a$10$LGvwGlOq9.2ahUvfRdypj.EddTci2pGmRyVL21to8L/vTyDovHiZa',
              name:data.displayName,
              profilePic:data.photos[0].value,
              isEmailVerified:true
            };

            User.create(newUser, function(err, added) {
                if (err) {
                  console.log(err);
                }
                return done(null, added);
            });
          }
        });
      });
}));

module.exports = {
signUp: (req, res, next) => {
// const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(200).json({ errors: errors.array()[0].msg });
//   }
console.log("Aman");
const url = req.get("host");
    // Check if there is a user with the same email
  bcrypt.hash(req.body.password, 10).then(hash => {
  User.findOne({ "email": req.body.email },function(err, user) {
    if (err) return done(err);
    if (user) {
       if(!user.isEmailVerified){
          res.status(201).json({
            message: "failure@Activate your account by clicking link in email!"
          })
        }else{
      return res.status(200).json({ error: 'failure@Email is already in use'});
    }}

    // Create a new user
   else { 
    var currentdate = new Date(); 
var datetime = currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getFullYear() + " "  
              + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
var dateString = datetime,
    dateTimeParts = dateString.split(' '),
    timeParts = dateTimeParts[1].split(':'),
    dateParts = dateTimeParts[0].split('-'),
    date;

date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);

console.log(date.getTime());
 //1379426880000
 var datetime1 = date.getTime();
    const newUser = new User({ 
        email: req.body.email, 
        password:hash,
        name: req.body.name,
        updatedPass:datetime1,
        profilePic:'https://instigo-project.appspot.com/'
    });
    console.log(newUser);
   newUser.save().then(result => { 
    const token = signToken(newUser);
    // Respond with signToken 
                         req.userID = result._id;
                         req.updateP = result.updatedPass;
             return verifyEmail.verifyemail(req,res,next);
                })  
    .catch(err => {
        return  res.status(200).json({
          message :  "failure"
            });
          });
    // Generate the token 
  }
  });
});
},

  signIn: async (req, res, next) => {

  //   const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(200).json({ errors: errors.array()[0].msg });
  // }


    let fetchedUser;
    User.findOne({ "email": req.body.email })
    .then(user =>{
      console.log("reached");
      if (!user) {
        return res.status(200).json({
          message: "failure@User Not found"
        });
    }
    fetchedUser = user;
       if (!user.isEmailVerified) {
       return res.status(200).json({
          message: "failure@First Activate your Account from your mailbox!"
        });
    }
  return bcrypt.compare(req.body.password,user.password);
}).then(result =>{
  if(!result){
    return res.status(200).json({
          message: "failure@password do not match"
        });
  }
 // var refreshTokens = {} 
   const token = JWT.sign(
        { id: fetchedUser._id,email:fetchedUser.email },
        JWT_SECRET,
        { expiresIn: "31536000h" }
      );
   //  req.session.user = fetchedUser;
   // var refreshToken = randtoken.uid(256);
   //  refreshTokens[refreshToken] = fetchedUser.name;
   //    console.log(req.user);
   //  res.json({token:  token, refreshToken: refreshToken}) 
  // console.log(req.session.user);
    
   res.status(200).json({
       message:"success",token: token,
        expiresIn: 3600,
        userId:fetchedUser._id,passLastUpdated:fetchedUser.updatedPass
      });
    })
    .catch(err => {
      return res.status(200).json({
        message: "failure@Invalid authentication credentials!"
      });
    });
},

  verify: async( req, res, next) => {
      Vemail.findOne({"userID": req.params.id1}, (err, result) =>{
      if(!result){
         res.status(201).json({
        message: "Email already Verified"
      });
      }
      else{
      User.updateOne({_id: req.params.id1},{"isEmailVerified": true}).then(result =>{console.log(result)});
        Vemail.deleteOne({"userID": req.params.id1}).catch(error => {
          console.log(error);
        })
        res.render('../views/suc.ejs');
      // res.status(201).json({
      //   message: "Email Verified"
      // });
 }
    // else{
    //   res.status(500).json({
    //     message: "Invalid User Credentials!"
    //   })
    // }
  })   
 },
 profile: async(req,res,next) =>{
  // if(!req.session.user){
  //   return res.status(200).send("failure@Not Authorized");
  // }
  var tok = decode(req.params.id);
  User.findById(tok.id).then(user => {
    if (user) {
      const details = {
        email: user.email,
        name: user.name,
        year: user.year,
        gender: user.gender,
        branch: user.branch,
        profilePic: user.profilePic,
        coverPic:user.coverPic,
        hostel:user.hostel,
        dob:user.dob,
        phone:user.phone
      }
      res.status(200).json(details);
    } else {
      res.status(404).json({ message: "failure@User not found!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "failure@Fetching User failed!"
    });
  });
 },
 updateProfile: async(req,res,next) =>{
  // if(!req.session.user){
  //   return res.status(200).send("failure@Not Authorized");
  // }
  var tok = decode(req.params.id);
  User.updateOne({'_id':tok.id},{'branch':req.body.branch,'year':req.body.year,'gender':req.body.gender,'hostel':req.body.hostel,'phone':req.body.phone,'dob':req.body.dob})
  .then(result =>{
    console.log(result);
     if (result.n > 0) {
      res.status(200).json({ message: "success" });
      }else {
        res.status(200).json({ message: "failure@err in Updating" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "failure@User not found"
      });
    });
  },
  getProfilePic : async(req,res,next) =>{
  //   if(!req.session.user){
  //   return res.status(200).send("failure@Not Authorized");
  // }
  var tok = decode(req.params.id);
  User.findOne({'_id':tok.id}).then(user =>{
        res.status(200).json(user.profilePic);
  });
  },
   getCoverPic : async(req,res,next) =>{
  //   if(!req.session.user){
  //   return res.status(200).send("failure@Not Authorized");
  // }
  var tok = decode(req.params.id);
  User.findOne({'_id':tok.id}).then(user =>{
        res.status(200).json(user.coverPic);
  });
},
  getpicnameemail : async(req,res,next) =>{
  //   if(!req.session.user){
  //   return res.status(200).send("failure@Not Authorized");
  // }
  var tok = decode(req.params.id);
  User.findOne({'_id':tok.id}).then(user =>{
   var userInfo = {name:user.name,
                   email:user.email,
                  profilePic:user.profilePic};
        res.status(200).json(userInfo);
  });
  // generateToken: async(req,res,next)=>{
  //   var userId = req.body.id
  // var refreshToken = req.body.refreshToken
  // if( refreshTokens[refreshToken] == userId) {
  //   var token = JWT.sign(userId,  JWT_SECRET, { expiresIn: 300 })
  //   res.status(200).json({token: token});
  // }
  // else {
  //   res.send(200)
  // }
  // }
}
 }

 