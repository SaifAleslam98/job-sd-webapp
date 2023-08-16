const Jobs = require('../models/jobsModel');
class apiFeatures {
    constructor(mongoQuery, queryString) {
        this.mongoQuery = mongoQuery;
        this.queryString = queryString;
    }

    filter() {
        const queryStringObj = { ...this.queryString };
        const excludesFields = ['page', 'limit', 'sort', 'feilds']
        excludesFields.forEach((feild) => delete queryStringObj[feild])
        let queryStr = JSON.stringify(queryStringObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        this.mongoQuery = this.mongoQuery.find(JSON.parse(queryStr))
        return this;
    }

    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.mongoQuery = this.mongoQuery.sort(sortBy)
        } 
        return this;
    }

    limitFeilds() {
        if (this.queryString.feilds) {
            const feilds = this.queryString.feilds.split(',').join(' ')
            this.mongoQuery = this.mongoQuery.select(feilds)
        } else {
            this.mongoQuery = this.mongoQuery.select('-__v')
        }
        return this;
    }

    search(modelName) {
        if (this.queryString.keyword) {
            let query = {};

            query.$or = [
                { title: { $regex: this.queryString.keyword, $options: 'i' } },
                { description: { $regex: this.queryString.keyword, $options: 'i' } }
            ];
           
            this.mongoQuery = modelName.find(query)

        }

        return this;
    }

    paginate(countDocuments) {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 2;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;

        // Pagination Result
        const Pagination = {};
        Pagination.currentPage = page;
        Pagination.limit = limit;
        Pagination.numberOfPages = Math.ceil(countDocuments / limit);

        // next page

        if (endIndex < countDocuments) {
            Pagination.next = page + 1
        }
        // prev page
        if (skip > 0) {
            Pagination.prev = page - 1
        }
        this.paginationResult = Pagination;
        this.mongoQuery = this.mongoQuery.skip(skip).limit(limit)
        return this;
    }
}
module.exports = apiFeatures