var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;

var workspaceSchema = new mongoose.Schema({
    name: String,
    username: { type: String, required: true, unique: false, trim: true },
    email: { type: String, required: true, unique: false, trim: true },
    workspace: String,
    created_at: {type: Date, default: Date.now()}
  });



  // we need to create a model using it
  var Workspace = mongoose.model('Workspace', workspaceSchema);
  
  // make this available to our users in our Node applications
  module.exports = Workspace;