const Joi = require("joi");

module.exports.listingSchema = Joi.object({
     listing : Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("",null),
        description: Joi.string().allow("", null),
        category: Joi.string().valid("Rooms", "Farms", "Beach", "Lake", "Camping", "Iconic City", "Towers", "Castles", "Pools", "Top Cities").required()
     }).required()
});


module.exports.reviewSchema = Joi.object({
   review: Joi.object({
     rating: Joi.number().required().max(5).min(1),
     comment: Joi.string().required(),  
   }).required(),
})