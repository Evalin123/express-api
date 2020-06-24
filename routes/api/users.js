const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../../models/User');
const secret = require('../../config/keys').secret;

const router = express.Router();

router.get('/', (request, response) => {
  User.find({}, (err, users) => {
    response.json(users);
  })
});

router.post('/register', (request, response) => {
  User.findOne({email:request.body.email})
  .then(user => {
    if (user) {
      return response.json({status: 'error', msg: "email exist"});
    } 
    else {
      const newUser = new User({
        name : request.body.name,
        password : request.body.password,
        email : request.body.email,
        description : request.body.description,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err)
            throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => response.json(user))
            .catch(err => response.json({status: 'error', data: err}));
        })
      })
    }
  })
});

router.post('/login', (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  User.findOne({email:email})
  .then(user => {
    if (user) {
      bcrypt.compare(password, user.password) 
      .then(result => {
          if (result) {
            const rule = {
              id : user.id,
              name : user.name,
              email : user.email
            }
            jwt.sign(rule, secret, {expiresIn:1800}, (err, token) => {
            response.json({
              status : 'success',
              token : 'Bearer ' + token
            })  
            });
          }else {
            return response.json({status: 'error', msg: "incorret password"});
          }
        })
    }else {
      return response.json({status: 'error', msg: "no user"});
    }
  })
  .catch(err => response.json({status: 'error', data: err}));
});

router.post('/edit/:id', passport.authenticate('jwt', {session:false}), (request, response) => {
  const id = request.params.id;
  const description = request.body.description;
  User.findOneAndUpdate({_id : id}, 
    {$set : {description : description}}, 
    {new : true})
  .then(user => response.json(user))
  .catch(err => response.json({status: 'error', data: err}));
});

router.delete('/delete/:id', passport.authenticate('jwt', {session:false}), (request, response) => {
  const id = request.params.id;
  User.findOneAndDelete({_id : id})
  .then(user => response.json(user))
  .catch(err => response.json({status: 'error', data: err}));
});

router.get('/current', passport.authenticate('jwt', {session:false}), (request, response) => {
  response.json(request.user);
});

module.exports = router;