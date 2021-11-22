const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({
        "company":"caressa"
    })
    res.status(200).json({products})
}

const getAllProducts = async (req, res) => {
    const {name, featured, company, rating, sort, fields, numericFilters} = req.query
    const queryObject= {}

    if (featured) {
        queryObject.featured= featured === 'true' ? true : false
    }

    if (company) {
        queryObject.company= company 
    }

    if (rating) {
        queryObject.rating= rating 
    }

    if (name) {
        queryObject.name = {$regex:name, $options:"i"} 
    }

    if (numericFilters) {
        const operatorMap = {
            ">":"$gt",
            ">=":"$gte",
            "=":"$eq",
            "<":"$lt",
            "<=":"$lte"
        }
        const regEx = /\b(<|>|>=|=|<=|)\b/g
        let filters= numericFilters.replace(reqEx, (match)=>{
            `-${operatorMap[match]}-`
        })
    }

    let result = Product.find(queryObject)

    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }

    if (fields) {
        const fieldList = fields.split(',').join(' ')
        result = result.select(fieldList)
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1)*limit

    result = result.skip(skip).limit(limit)

    const products = await result
    res.status(200).json({products})
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}