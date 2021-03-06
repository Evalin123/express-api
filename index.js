const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const keys = require('./config/keys');
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');

const app = express();
const port = 5000;

mongoose.connect(keys.mongoUri, {
  useNewUrlParser: true
})
  .then(() => {
    console.log(`mongoose connect db`)
  })
  .catch((error) => {
    console.log(error)
  })

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/posts', posts);

app.get('/', (request, response) => {
  response.send('Hello');
});