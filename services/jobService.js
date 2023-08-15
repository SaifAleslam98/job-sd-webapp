const Jobs = require('../models/jobsModel');
const handler = require('./handler')


exports.setFilterObject = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) filterObject = { category: req.params.categoryId }
    req.filterObj = filterObject;
    next();
};

const pageRender = {
    title: 'الرئيسية',
    renderPage: 'index',

}
exports.getAllJobs = handler.getAll(Jobs,pageRender);

exports.addJob = handler.createOne(Jobs);