const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../Models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");



const listingController = require("../controller/listings.js");

const {storage} =require("../cloudConfig.js");

const multer = require("multer");
const upload = multer({ storage });



//index route
router.get("/", wrapAsync(listingController.index));

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//to filter listing
router.get("/filter", wrapAsync (listingController.filterListing));



// Search route
router.get("/search", wrapAsync(listingController.searchListings));

//show route
router.get("/:id", wrapAsync(listingController.showListing));

// Define a route for showing no listings found
router.get("/no-listings", (req, res) => {
    res.render("listings/no-listings");
});


//create route
router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));

router.post("/", (req, res)=>{
    res.send(req.file);
})

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

//update route
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing));

//delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


module.exports = router;