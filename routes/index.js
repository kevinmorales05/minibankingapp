const passport = require("passport");

const router = require("express").Router();

router.use("/", require("./swagger"));

router.use("/users", require("./users"));
router.use("/balance", require("./balance"));
router.use("/transactions", require("./transactions"));
router.use("/accounts", require("./account"));
router.use("/reverses", require("./reverses"));
router.use("/address", require("./address"));


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
