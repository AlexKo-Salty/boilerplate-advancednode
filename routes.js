const passport = require('passport');
const bcrypt = require('bcrypt');

module.exports = function (app, myDataBase) {

    app.route('/').get((req, res) => {
        res.render('pug', {
          title: 'Connected to Database',
          message: 'Please login',
          //Tutorial 7
          showLogin: true,
          showRegistration: true
        });
      });
    
      //Tutorial 7
      app.route('/login').post(passport.authenticate('local', { failureRedirect: '/'}), (req, res) => {
        res.redirect('/profile');
      })
    
      //Tutorial 8
      function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
          return next();
        }
        res.redirect('/');
      }
    
      app.route('/profile').get(ensureAuthenticated, (req, res) => {
        //Tutorial 9
        res.render(process.cwd() + '/views/pug/profile',{
          username: req.user.username
        });
      });
    
      //Tutorial 10
      app.route('/logout').get((req, res) => {
        req.logout();
        res.redirect('/');
      })
    
      //Tutorial 11
      app.route('/register').post((req, res, next) => {
        //Find if user exist
        myDataBase.findOne({ username: req.body.username}, function(err, user){
          if (err) {
            next (err);
          } else if (user) {
            res.redirect('/');
          } else {
            //Tutorial 12
            const hash = bcrypt.hashSync(req.body.password, 12);
    
            myDataBase.insertOne({
              username: req.body.username,
              password: hash
            }, (err, doc) => {
              if (err) {
                res.redirect('/');
              } else {
                next(null, doc.ops[0]);
              }
            })
          }
        })
      }, passport.authenticate('local', { failureRedirect: '/'}), (req,res,next) => {
        res.redirect('/profile');
      });
    
      //Tutorial 10
      app.use((req, res, next) => {
        res.status(404)
          .type('text')
          .send('Not Found');
      })    
}