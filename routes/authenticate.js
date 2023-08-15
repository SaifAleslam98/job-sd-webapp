var express = require('express');
const passport = require('passport');
const csrf = require('csurf');
const { createUser, signIn } = require('../services/authService');
const { createUserValidate, signInValidate } = require('../utils/validators/userValidator');
const { isSignIn, isNotSignIn } = require('../controller/userControl');
var router = express.Router();


//@desc Signup router
router.post('/signin', signInValidate, signIn, passport.authenticate('local-signin', {
    successRedirect: '/',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.post('/signup',createUserValidate, createUser);

//@desc logout router
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/users/signin');
    });
});
module.exports = router;