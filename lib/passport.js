import passport from "passport";
import {Strategy as DiscordStrategy} from "@navy.gif/passport-discord";
import {Strategy as JwtStrategy, ExtractJwt} from "passport-jwt";
import dbConnect from "@utils/connectdb";

import DiscordUser from "@models/discorduser";
import {basePath} from "next.config";

const scopes = ["identify", "guilds"];
const {NEXT_PUBLIC_URL} = process.env.NEXT_PUBLIC_URL;

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: `${NEXT_PUBLIC_URL}${basePath}/api/users/auth/discord/callback`,
      scope: scopes,
      version: 10,
    },
    async (accessToken, refreshToken, profile, cb) => {
      await dbConnect();

      DiscordUser.findByIdAndUpdate(
        profile.id,
        {
          $set: {
            discordSession: {
              accessToken: accessToken,
              refreshToken: refreshToken,
            },
          },
        },
        {
          setDefaultsOnInsert: true,
          upsert: true,
          new: true,
          rawResult: true,
        },
      ).then((res) => {
        cb(null, res.value);
      });
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  DiscordUser.findById(id).then((user, err) => {
    done(null, user);
  });
});

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

// Used by the authenticated requests to deserialize the user,
// i.e., to fetch user details from the JWT.
passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    // Check against the DB only if necessary.
    // This can be avoided if you don't want to fetch user details in each request.
    DiscordUser.findOne({_id: jwt_payload._id}, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(
          {
            status: 401,
            error: "Unauthorized",
            message: "You are not authorized to access this resource",
          },
          false,
        );
        // or you could create a new account
      }
    });
  }),
);

export default passport;
