/* Add Twitch Authentication */

// Passport for oauth
var twitchStrategy = require('passport-twitch').Strategy;

module.exports = function(options, passport, app) {

  // app.use(cookieSession({secret: options.twitchClientID}));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new twitchStrategy({
      clientID: options.twitchClientID,
      clientSecret: options.twitchSecret,
      callbackURL: "http://localhost:5000/auth/twitch/callback",
      scope: "user_read"
    },
    function(accessToken, refreshToken, profile, done) {
      // console.log(accessToken);
      // console.log(refreshToken);
      console.log(profile);
      done(null, 5);
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  app.get("/auth/twitch", passport.authenticate("twitch"));
  app.get("/auth/twitch/callback", passport.authenticate("twitch", { successRedirect: '/', failureRedirect: "/test" }));
}
