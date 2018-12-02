var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Workspace = require('../models/workspace');
var templater = require('../templater');
var zip = require('express-zip');
var title = 'Alexa Automated';
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: title, signed_in: req.session.signed_in , username: req.session.email});
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: title, signed_in: req.session.signed_in , username: req.session.email});
});

router.post('/generateSkill', function(req, res){
  let lambdaFilePath = 'alexa-skill/index.js'
  let skillFilePath = 'alexa-skill/skill.json'
  let intents = []
  let lambdaCode = templater.generateLambdaFunction(intents)
  templater.writeToFile(lambdaFilePath, lambdaCode)

  res.zip([
    {path: 'alexa-skill/index.js', name: 'index.js'},
    {path: 'alexa-skill/skill.json', name: 'skill.json'}
  ])
});


router.get('/signin', function(req, res, next) {
  res.render('signin', { title: title, signed_in: req.session.signed_in , username: req.session.email});
});

router.get('/design', function(req, res, next){
    //var workspaces=null;
    var usersWorkspaces=null;
    console.log('Username: '+req.session.username);
    var query = Workspace.find({username: 'collin124'});
    if(req.session.signed_in){
      //workspaces = Workspace.find({username: req.session.username});
      Workspace.find({username: req.session.username}).exec(function(error, workspaces){
        if(error){
          return next(error);
        }
        else{
          console.log("Workspaces: "+workspaces);
          usersWorkspaces = workspaces;
          //, workspaces1: workspaces
        }
        if(usersWorkspaces!=null){
          return res.render('design', { workspaces1: workspaces,title: title, signed_in: req.session.signed_in , username: req.session.email});
        }
      });
    }
    else{
      res.render('design', {title: title, signed_in: req.session.signed_in , username: req.session.email});
    }
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

// POST authenticate for sign in behavior
router.post('/authenticate', function (req, res, next) {
  if (req.body.email && req.body.password) {
      User.authenticate(req.body.email, req.body.password, function (error, user) {
        if (error || !user) {
          var err = new Error('Wrong email or password.');
          err.status = 401;
          return next(err);
        } else {
          req.session.userId = user._id;
          req.session.email = user.email
          req.session.signed_in = true;
          //return res.redirect('back');
          return res.redirect('/profile');
        }
      });
    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
  });
    
router.post('/profile', function (req, res, next) {
if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;  
        req.session.email = user.email;
        req.session.name = user.name;
        req.session.username = user.username;
        req.session.dateCreated = Date.f(user.created_at);
        req.session.signed_in = true;
        console.log("Email: " + req.session.email);
        //return res.redirect('back');
        return res.redirect('/profile', {email: req.session.email, name: req.session.name, username: req.session.username, dateCreated: req.session.dateCreated});
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
});

router.post('/', function (req, res, next) {
  console.log("Im on the homepage!")
  if (req.body.email &&
    req.body.username &&
    req.body.name &&
    req.body.password) {

    var userData = {
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        User.authenticate(req.body.email, req.body.password, function (error, user) {
          if (error || !user) {
            var err = new Error('Wrong email or password.');
            err.status = 401;
            return next(err);
          } else {
            req.session.userId = user._id;
            req.session.email = user.email;
            req.session.name = user.name;
            req.session.username = user.username;
            req.session.dateCreated = user.created_at;
            req.session.signed_in = true;
            return res.redirect('/profile');
          }
        });
      }
    });
  }
  });

router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          req.session.userId = user._id;
          req.session.email = user.email;
          req.session.name = user.name;
          req.session.username = user.username;
          req.session.dateCreated = user.created_at;
          res.render('profile', { title: title, signed_in: req.session.signed_in, email: req.session.email, name: req.session.name, username: req.session.username, dateCreated: req.session.dateCreated});
        }
      }
    });
});

/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/users/cool/', function(req, res, next) {
  res.send('You\'re so cool');
});


router.post('/saveworkspace', function (req, res, next){
  var text = req.body.xml;
  var workspaceName = req.body.workspaceName;
  console.log(text);
  console.log(workspaceName);
      if (!req.session.signed_in) {
        var err = new Error('Please log in to save a workspace!');
        err.status = 401;
        return next(err);
      } 
      else {  
        var workspaceData = {
          name: workspaceName,
          username: req.session.username,
          email: req.session.email,
          workspace: text
        }
        console.log('Right Here');
        Workspace.create(workspaceData, function (error, savedWorkspace) {
          if (error) {
            console.log('error')
            return next(error);
          } 
          else {
            console.log("im right here");
          }
        });
      }
  res.redirect('/design');
});
module.exports = router;
