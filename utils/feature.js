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
        } else {
            this.mongoQuery = this.mongoQuery.sort('-createdAt')
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
            if (modelName = 'Product') {
                query.$or = [
                    { title: { $regex: this.queryString.keyword, $options: 'i' } },
                    { description: { $regex: this.queryString.keyword, $options: 'i' } }
                ];
                const Product = require('../models/productModel');
                this.mongoQuery = Product.find(query)
            }  if (modelName = 'Brand') {
                query = { name: { $regex: this.queryString.keyword, $options: 'i' } }
                const Brand = require('../models/brandModel');
                this.mongoQuery = Brand.find(query)
            }
            if (modelName = 'Category') {
                query = { name: { $regex: this.queryString.keyword, $options: 'i' } }
                const Category = require('../models/categoryModel');
                this.mongoQuery = Category.find(query)
            }
            if (modelName = 'SubCategory') {
                query = { name: { $regex: this.queryString.keyword, $options: 'i' } }
                const SubCategory = require('../models/subCategoryModel');
                this.mongoQuery = SubCategory.find(query)
            }
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