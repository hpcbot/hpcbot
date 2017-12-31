/* Add Twitch Authentication */

// Passport for oauth
var twitchStrategy = require('passport-twitch').Strategy;

module.exports = function(options, passport, app) {

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new twitchStrategy({
      clientID: options.twitchClientID,
      clientSecret: options.twitchSecret,
      callbackURL: `http://${options.hostname}:${options.port}/auth/twitch/callback`, // Must match twitch dashboard settings
      scope: "user_read"
    },
    function(accessToken, refreshToken, profile, done) {
      if(options.whitelist.includes(profile.username)) {
        // Make sure this user can access the app
        let user = {
          username: profile.username,
          picture: profile._json.logo
        }

        done(null, user);
      } else {
        done('Sorry, you don\'t have access to this section.', null)
      }
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  app.get("/auth/twitch/", passport.authenticate("twitch"))
  app.get("/auth/twitch/callback", passport.authenticate("twitch", { successReturnToOrRedirect: '/', failureRedirect: "/denied" }));
}
