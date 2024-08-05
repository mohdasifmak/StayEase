const Listing = require("./Models/listing");
const Review = require("./Models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const review = require("./Models/review.js");

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){

        //save original url to redirect on that url which we want to access.
        req.session.redirectUrl = req.originalUrl;
        
        req.flash("error", "you must be signup first");
        return res.redirect("/signup")
     }
     next();
}


//we create this to store original url because when user login, session is refress and also it refress the store url.
module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}


//this middleware ensure that only owner of the listing is edit and delete the listing

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash('error', 'Listing not found.');
        return res.redirect('/listings');
    }

    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You Can't Do");
        return res.redirect(`/listings/${id}`);
    }

    next();
}


//middleware for validate listings

module.exports.validateListing = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
           
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);

        //throw new ExpressError(400, error);
    }else{
        next();
    }
};


//middleware for validate review

module.exports.validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
           
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);

        //throw new ExpressError(400, error);
    }else{
        next();
    }
};


//middleware for authenticate the author of the review writer
module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You Can't Do");
        return res.redirect(`/listings/${id}`);
    }

    next();
};




