var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var FileStore = require('session-file-store') (session)
//세션 저장하는 곳이 file로 되어있지만 mysql로 사용이 가능

var app = express()
  
// app.use : 사용자 요청이 있을때 실행되는
app.use(session({
  secret: 'keyboard cat', //꼭 넣어주어야하는 옵션
  resave: false,
  saveUninitialized: true, //세션이 필요할때까지 구동시키지 않는다.
  store:new FileStore()
}))

//기본적으로 세션은 메모리에 저장되어서 휘발된다.
app.get('/', function (req, res, next) {
    if(req.session.num === undefined) req.session.num = 1;
    else req.session.num =  req.session.num + 1;
    
    res.send(`Views : ${req.session.num}`);
})
 
app.listen(3000, function(){
    console.log('3000!');
});