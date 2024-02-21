//dependencies
const express = require("express");
const http = require("http");
const cors = require("cors");
const GithubStrategy = require("passport-github2").Strategy;
const passport = require("passport");
const session = require('express-session');
const bodyParser = require("body-parser");

const mongodb = require("./data/database.js");



const app = express();

const port = process.env.PORT || 3000;

app
  .use(express.json())
  .use(bodyParser.json())
  .use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .use((err, req, res, next) => {
    console.error(err.stack);
    // Responder con un código de estado 500 y un mensaje de error genérico
    res.status(500).json({ error: "Error interno del servidor" });
  })
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Z-Key"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    next();
  })
  .use(cors({ methods: ["GET", "POST", "PUT", "DELETE", "PATCH"] }))
  .use(cors({ origin: "*" }))
  .use("/", require("./routes"));

const server = http.createServer(app);

//configure oauth
passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done){
  //User.findOrCreate({githubId: profile.id}, function(err, user){
    return done(null, profile);
  //}); 
}
))
///functions for login 
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done)=> {
  done(null, user);
});

//request session
app.get('/', (req, res) => {
  if(req.session.user){
    //res.send(`Logged in as ${req.session.user.displayName}`);
    let userCreated = {
      "Message":"logged",
      "name": req.session.user.displayName,
      "githubid": req.session.user.id
    }
    
    res.status(200).json(userCreated);
  }
  else {
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged out")

  }
});
//authentication

app.get(
  '/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: false}),
    (req, res) => {
      req.session.user = req.user;
      res.redirect('/');
    }
);







mongodb.initDB((err) => {
  if (err) {
    console.log("Database is not connected!");
    console.log(err);
  } else {
    server.listen(port, () => {
      console.log(`Running on port ${port}`);
      console.log("Database is connected!");
    });
  }
});
