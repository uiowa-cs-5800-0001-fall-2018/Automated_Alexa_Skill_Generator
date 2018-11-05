var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bcrypt = require('bcrypt-nodejs');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var session = require('express-session');

var app = express();

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css/'))

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
//var mongoDB = 'mongodb://127.0.0.1/my_database';
//mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
var User = require('./models/user');
var CustomBlock = require('./models/custom_block');
//mongoose.connect('mongodb+srv://userName:Passwrod@cluster.mongodb.net/', {dbName: 'yourDbName'});
const uri = "mongodb://team-blue:toast42@cluster0-shard-00-00-atqcd.gcp.mongodb.net:27017,cluster0-shard-00-01-atqcd.gcp.mongodb.net:27017,cluster0-shard-00-02-atqcd.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"
mongoose.connect(uri, {dbName:'testProject'}, function (err) {
  
    if (err) throw err;
  
    console.log('Successfully connected');

    var query = User.findOne({name: 'CJ'});
    query.exec(function(err, person) {
      if(err) return handleError(err);

      if(person==null){
        var testUser = new User({
          _id: new mongoose.Types.ObjectId(),
          name: 'CJ',
          username: 'cedmnds',
          email: 'collin-edmonds@uiowa.edu',
          password: 'test',
          created_at: Date.now()
        });

        testUser.save(function(err) {
          if (err) throw err;
       
          console.log('User successfully saved.');
        });
      }
    });

    query = CustomBlock.findOne({type: 'intent_block'});
    query.exec(function(err, block) {
        if(err) return handleError(err);

        if(block==null){
            var testBlock = new CustomBlock({
                _id: new mongoose.Types.ObjectId(),
                type: 'intent_block',
                messages: ['sample_utterances %1 slots %2'],
                args: [[ { type: 'input_value', name: 'sample_utterances', check: 'Array' }, { type: 'input_value', name: 'slots', check: 'Array' }]],
                colour: 225,
                helpUrl: 'https://developer.amazon.com/docs/custom-skills/create-intents-utterances-and-slots.html'
            });

            testBlock.save(function(err) {
                if (err) throw err;

                console.log('Block successfully saved.');
            });
        }
    });
    
 });


module.exports = app;
