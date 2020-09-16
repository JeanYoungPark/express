const express = require('express')
const app = express()
var fs = require('fs')
var bodyParse = require('body-parser')
var compression = require('compression')
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var flash = require('connect-flash')

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
}));

app.use(flash());
var passport = require('./lib/passport')(app);

app.get('*',function(request,response,next){ //app which use get
  fs.readdir('./data', function(error, filelist){
    request.list = filelist; //can every route , request's list == filelist
    next(); //next middleware
  });
});

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth')(passport);
const { request, response } = require('express')

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
