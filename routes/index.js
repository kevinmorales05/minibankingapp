const passport = require("passport");

const router = require("express").Router();

router.use("/", require("./swagger"));

router.use("/users", require("./users"));
//router.use("/tasks", require("./tasks"));
//router.use("/goals", require("./goals"));

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function(req, res, next){
    req.logout(
        function(err){
            if(err){ return next(err);}
            res.redirect('/');
        }
    );
})

module.exports = router;
