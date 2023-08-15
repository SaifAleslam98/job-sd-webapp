var express = require('express');
const { getUserData } = require('../services/userService');
const { addJob } = require('../services/jobService');
const { createJob } = require('../utils/validators/userValidator');
const { isSignIn, isNotSignIn, isClient, isOwner} = require('../controller/userControl');
const passport = require('passport');
const csrf = require('csurf');
var router = express.Router();


router.use(csrf());
//@desc GET Signup 
router.get('/signup', isNotSignIn, (req, res, next) => {
  var messageError = req.flash('signupError');
  res.render('usersView/signup', {
    title: 'التسجيل',
    messages: messageError,
    token: req.csrfToken()
  })
});

//@desc GET Signin 
router.get('/signin', isNotSignIn, (req, res) => {
  var messageError = req.flash('signinError');
  res.render('usersView/signin', {
    title: 'دخول',
    messages: messageError,
    token: req.csrfToken()
  })
})

//@desc GET & POST addjob
router.route('/addjob').get(isSignIn, isClient, (req, res, next) => {
  var messageError = req.flash('addJobError');
  res.render('jobs/addjob', {
    title: 'إضافة وظيفة',
    messages: messageError,
    token: req.csrfToken()
  });
}).post(createJob, addJob);

router.route('/addEmployee').get(isSignIn, isOwner, (req, res, next) => {
  var messageError = req.flash('addJobError');
  res.render('jobs/addemployee', {
    title: 'إضافة وظيفة',
    messages: messageError,
    token: req.csrfToken()
  });
}).post(createJob, addJob);

router.get('/profile', isSignIn, getUserData);

module.exports = router;
