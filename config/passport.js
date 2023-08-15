const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Job = require('../models/jobsModel');



passport.serializeUser((user, done) => {
    return done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id).then(async user => {
        const job = await Job.find({user: id}).lean().then(job=>{
            
            user.job = job;
            
            return done(null , user)
        }).catch(err => {
            return done(err , user)
        });
    }).catch(err => {
        return done(err, user)
    });


});
/** User Sign in Using Passport */
passport.use('local-signin', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await User.findOne({ email: email });

    if (!user) {
        return done(null, false, req.flash('signinError', 'هذا المستخدم غير موجود'));
    }
    if (!(await bcrypt.compare(req.body.password, user.password))) {
        return done(null, false, req.flash('signinError', 'كلمة المرور غير صحيحة'));
    }
    return done(null, user)

}));