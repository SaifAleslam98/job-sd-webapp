const slugify = require('slugify');
//const bcrypt = require('bcryptjs');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validator');
const User = require('../../models/userModel');

exports.createUserValidate = [
    check('username')
        .notEmpty().withMessage('يجب ادخال اسم المستخدم')
        .isLength({ min: 3 })
        .withMessage('اسم المستخدم قصير جداً')
        .isLength({ max: 20 })
        .withMessage('Too long User name')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true
        }),
    check('phone')
        .notEmpty()
        .withMessage('يحب ادخال  الالكتروني')
        .isEmail()
        .withMessage('البريد الالكتروني غير صحيح')
        .custom((val) => User.findOne({ email: val }).then(user => {
            if (user) {
                return Promise.reject(new Error('تم استخدام هذا البريد الالكتروني من قبل'));
            }
        })),
    check('password')
        .notEmpty()
        .withMessage('يجب ادخال كلمة المرور')
        .isLength({ min: 6 })
        .withMessage('كلمة المرور يجب ان تكون 6 احرف علي الاقل')
        .custom((password, { req }) => {
            if (password !== req.body.passwordConfirm) {
                throw new Error('كلمةالمرور و تأكيد كلمة المرور غير متطابقين');
            }
            return true;
        }
        ),
    check('passwordConfirm')
        .notEmpty()
        .withMessage('يجب تأكيد كلمة المرور')
    ,


]

exports.signInValidate = [
    check('email')
        .notEmpty()
        .withMessage('يحب ادخال البريد الالكتروني')
        .isEmail()
        .withMessage('البريد الالكتروني غير صحيح'),
    check('password')
        .notEmpty()
        .withMessage('يجب ادخال كلمة المرور')
]

exports.createJob = [
    check('title')
        .notEmpty().withMessage('قم بإدخال عنوان الوظيفة'),
    check('description')
    .notEmpty().withMessage('قم بإدخال وصف الوظيفة'),
]