const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const bcrypt = require("bcryptjs");
const db = require("../db/connection");

GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || "default_google_client_id";
GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "default_google_client_secret";
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

module.exports = function (passport) {
  // Local Strategy for login
  passport.use(
    new LocalStrategy(
      { usernameField: "username", passReqToCallback: true},
      (req, username, password, done) => {
        db.query(
          "SELECT * FROM users WHERE username = ? AND password IS NOT NULL",
          [username],
          (err, results) => {
            if (err) return done(err);
            if (results.length === 0)
              return done(null, false, { message: "No user found" });

            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) return done(err);
              if (isMatch) {
                if(req.body.domain != ""){
                  console.log("Domain Login Request: " + req.body.domain);
                  db.query(
                    "SELECT * FROM employee e WHERE e.company_id = (SELECT c.id FROM company c WHERE domain_name = ?) AND e.user_id = ?",
                    [req.body.domain, user.id],
                    (err2, results2) => {
                      if (err2) return done(err2);
                      if (results2.length === 0)
                        return done(null, false, { message: "User Not Part of Company" });

                      return done(null, user);
                    }
                  )
                } else {
                  return done(null, user);
                }
              }
              else return done(null, false, { message: "Incorrect password" });
            });
          }
        );
      }
    )
  );

  // JWT Strategy
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
      },
      (jwtPayload, done) => {
        db.query(
          "SELECT * FROM users WHERE id = ?",
          [jwtPayload.id],
          (err, results) => {
            if (err) return done(err, false);
            if (results.length === 0) return done(null, false);
            return done(null, results[0]);
          }
        );
      }
    )
  );

  // Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        try {
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName;
          const picture = profile.photos?.[0]?.value;

          // Check the database for google_id's
          db.query(
            "SELECT * FROM users WHERE username = ?",
            [googleId],
            (err, rows) => {
              let user;

              if (rows.length > 0) {
                user = rows[0]; // The user exists!
              } else {
                // Insert new user
                db.query(
                  "SELECT * FROM users WHERE email = ?",
                  [email],
                  (er, resl) => {
                    if (resl.length > 0) {
                      return done(
                        new Error(
                          `Google Authentication Error : User uses local login`
                        )
                      );
                    }
                  }
                );
                console.log("Google Name: " + name);
                db.query(
                  "INSERT INTO users (first_name, last_name, username, email, image_src) VALUES (?, ?, ?, ?, ?); SELECT LAST_INSERT_ID() AS insertId",
                  [
                    name.split(" ")[0],
                    name.split(" ")[1],
                    googleId,
                    email,
                    picture,
                  ],
                  (error, result) => {
                    if (error) {
                      console.error("/auth/google/passport : " + error);
                      return done(new Error(`Registration failed: ${error}`));
                    }
                    console.log("/auth/google/passport : " + result);
                    user = {
                      id: result.insertId,
                      google_id: googleId,
                      name,
                      email,
                      picture,
                    };
                  }
                );
              }
              console.log("/auth/google/passport : Success");
              return done(null, user);
            }
          );
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
