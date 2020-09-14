const express = require('express')
const app = express()
var fs = require('fs')
var bodyParse = require('body-parser')
var compression = require('compression')
var session = require('express-session')
var FileStore = require('session-file-store')(session)

var helmet = require('helmet');
app.use(helmet());

app.use(express.static('public'));
app.use(bodyParse.urlencoded({extended:false})); //body parsing..
app.use(compression());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}))

var authData = {
  email:'jeanfree1@naver.com',
  password:'111111',
  nickname:'jjing9'
}

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
 
passport.use(new LocalStrategy({
    usernameField:'email',
    passwordField:'pwd'
  },
  function(username, password, done){
    if(username === authData.email){
      if(password === authData.password){
        return done(null,authData);
      }else {
        return done(null,false,{
          message : 'Incorrect password.'
        });
      }
    }else {
      return done(null,false, {
        message : 'Incorrect username.'
      });
    }
  })
);

app.post('/auth/login_process',
  passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/auth/login'
}));

app.get('*',function(request,response,next){ //app which use get
  fs.readdir('./data', function(error, filelist){
    request.list = filelist; //can every route , request's list == filelist
    next(); //next middleware
  });
});

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth');

app.use('/',indexRouter);
app.use('/topic',topicRouter);
app.use('/auth',authRouter);

app.use(function(req,res,next){
  res.status(404).send("Sorry cant find that!");
});

app.use(function(err,req,res,next){
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
