const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { validationResult } = require('express-validator');

exports.signIn = asyncHandler(async(req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        var validationMessages = [];
        for (var i = 0; i < errors.errors.length; i++) {
            validationMessages.push(errors.errors[i].msg);
        }
        req.flash('signinError', validationMessages);
        res.redirect('/users/signin')
        return;
    }
    next();
});

exports.createUser = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        var validationMessages = [];
        for (var i = 0; i < errors.errors.length; i++) {
            validationMessages.push(errors.errors[i].msg);
        }
        req.flash('signupError', validationMessages);
        res.redirect('/users/signup')
        return;
    }
    const user = await User.create({
        name: req.body.username,
        slug: slugify(req.body.username),
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        accountType: req.body.account,
        password: req.body.password,
        city: req.body.city
    })
    res.redirect('/users/signin')
});