const express = require('express');
const passport = require('passport');

const Post = require('../../models/Post');

const router = express.Router();

router.post('/create', passport.authenticate('jwt', {session:false}), (request, response) => {
  const currentUser = request.user;
  const newPost = new Post({
    userId : currentUser.id,
    title : request.body.title,
    content : request.body.content,
  });
  newPost.save()
    .then(post => response.json(post))
    .catch(err => response.json({status: 'error', data: err}));
});

router.post('/edit/:id', passport.authenticate('jwt', {session:false}), (request, response) => {
  const id = request.params.id;
  const opts = {};
  opts.title = request.body.title;
  opts.content = request.body.content;
  Post.findOneAndUpdate({_id : id}, 
    {$set : opts}, 
    {new : true})
  .then(post => response.json(post))
  .catch(err => response.json({status: 'error', data: err}));
});

router.get('/:id', passport.authenticate('jwt', {session:false}), (request, response) => {
  const id = request.params.id;
  Post.findById(id)
  .then(post => response.json(post))
  .catch(err => response.json({status: 'error', data: err}));
});

router.get('/', (request, response) => {
  Post.find({}, (err, posts) => {
    response.json(posts);
  })
});

router.delete('/delete/:id', passport.authenticate('jwt', {session:false}), (request, response) => {
  const id = request.params.id;
  Post.findOneAndDelete({_id : id})
  .then(post => response.json(post))
  .catch(err => response.json({status: 'error', data: err}));
});

module.exports = router;
