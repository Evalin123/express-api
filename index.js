const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const keys = require('./config/keys');

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

app.get('/', (request, response) => {
  response.send('Hello');
});