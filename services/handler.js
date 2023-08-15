const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Job = require('../models/jobsModel');
const ApiFeatures = require('../utils/feature');
const { validationResult } = require('express-validator');

exports.getAll = (Model, pageRender) => asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
        filter = req.filterObj
    }
    const documentCount = await Model.countDocuments();
    const apiFeature = new ApiFeatures(Model.find(filter).lean(), req.query)
        .filter()
        .limitFeilds()
        .sorting()
        .search(Model)
        .paginate(documentCount);

    //Execute
    const { mongoQuery, paginationResult } = apiFeature;
    document = await mongoQuery.populate('user', 'name phone city');
    var owner = null
    async function checkOwner() {
        if (req.isAuthenticated()) {
            if (req.user.accountType == "client") {
                owner = false
            }
            else {
                owner = true
            }
        }
    }
    checkOwner()
    const dt = new Date();
    console.log((dt - document[0].createdAt).toLocaleString())
    for(var count = 0; count < document.length; count++) {
        document[count].createdAt = (document[count].createdAt).toLocaleDateString()
    }
    res.render(pageRender.renderPage, {
        title: pageRender.title,
        checkuser: req.isAuthenticated(),
        isowner: owner,
        resault: document.length,
        paginationResult,
        data: document
    });


});

exports.createOne = (Model) => asyncHandler(async (req, res, next) => {
    let flashMsg = null;
    let successMsg = null;
    let jobType = null;
    if (req.user.accountType == 'client') {
        flashMsg = 'addEmployeeError';
        successMsg = 'تم إضافة عرضك كموظف'
        jobType = 'موظف';
    } else {
        flashMsg = 'addJobError';
        successMsg = 'تم إضافة الوظيفة';
        jobType = 'وظيفة'
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        var validationMessages = [];
        for (var i = 0; i < errors.errors.length; i++) {
            validationMessages.push(errors.errors[i].msg);
        }
        req.flash(flashMsg, validationMessages);
        res.redirect(req.originalUrl)
        return;
    }
    const user = await User.findById(req.user.id, '_id name phone accountType city ');
    if (!user) {
        return next(new AppError(`قم بتسجيل الدخول من جديد `, 404))
    }
    const job = await Model.create({
        user: req.user._id,
        title: req.body.title,
        description: req.body.description,
        salary: req.body.salary,
        jobType: jobType
    });
    req.flash(flashMsg, successMsg)
    res.redirect(req.originalUrl);
})