var express = require('express');
var router = express.Router();
var User = require('../models/user');
var title = 'Alexa Automated'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: title, signed_in: req.session.signed_in , username: req.session.email});
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: title, signed_in: req.session.signed_in , username: req.session.email});
});


router.get('/signin', function(req, res, next) {
  res.render('signin', { title: title, signed_in: req.session.signed_in , username: req.session.email});
});

router.get('/design', function(req, res, next){
  res.render('design', { title: title, signed_in: req.session.signed_in , username: req.session.email});
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
          res.render('profile', { title: title, email: req.session.email, name: req.session.name, username: req.session.username, dateCreated: req.session.dateCreated});
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
module.exports = router;
