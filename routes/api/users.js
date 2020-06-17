const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../../models/User')

const router = express.Router();

router.post('/register', (request, response) => {
  User.findOne({email:request.body.email})
  .then(user => {
    if (user) {
      return response.status(400).json({msg: "email exist"});
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

module.exports = router;