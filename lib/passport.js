var db = require('../lib/db');

module.exports = function(app){
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize()); 
    app.use(passport.session()); 

    passport.serializeUser(function(user,done){
        done(null,user.id);
    });
    passport.deserializeUser(function(id,done){
        var user = db.get('users').find({id:id}).value();
        done(null,user);
    });

    passport.use(new LocalStrategy({
        usernameField:'email',
        passwordField:'pwd'
    },  function(username, password, done){
            if(username === authData.email){
                    if(password === authData.password){
                        return done(null,authData,{
                            message : 'Welcome.'
                        }); 
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
    return passport;
}