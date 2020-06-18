const monegoose = require('mongoose');

const Schema = monegoose.Schema;

const PostSchema = new Schema({
  userId : {
    type : String,
    required : true
  },
  title : {
    type : String,
    required : true
  },
  content : {
    type : String,
    required : true
  },
  createDate : {
    type : Date,
    default : Date.now
  },
});

PostSchema.methods.toJSON = function() {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = Post = monegoose.model('posts',PostSchema);