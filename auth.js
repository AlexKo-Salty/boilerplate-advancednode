const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID;

module.exports = function (app, myDataBase) {
  //Tutorial 4
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
      done(null,doc);
    });
  });

  //Tutorial 6
  passport.use(new LocalStrategy(
    function(username, password, done){
      myDataBase.findOne({ username: username }, function (err, user) {
        console.log('User ' + username + ' attempted to log in.');
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        //Tutorial 12
        if (!bcrypt.compareSync(password, user.password)) { return done(null, false)}
        return done(null, user);
      })
    }
  ))
}