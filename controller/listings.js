const Listing = require("../Models/listing");
const axios = require('axios');

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({}).populate("owner");
    res.render("listings/index.ejs", {allListings});
};


module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
};



module.exports.filterListing = async (req, res) => {
    const { category } = req.query;

    //console.log('Filter category:', category); 

    try {
        const filteredListings = await Listing.find({ category }).populate('owner');

        if (filteredListings.length === 0) {
            return res.render('listings/no-listings.ejs', { category });
        }
        res.render('listings/filter.ejs', { allListings: filteredListings });
    } catch (err) {
        console.error('Error fetching filtered listings:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports.createListing = async(req, res, next)=>{


        let {location} = req.body.listing;
        let geocodeUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(location)}&apiKey=${process.env.MAP_API_KEY}`;

        let response;

    try {
        response = await axios.get(geocodeUrl);
    } catch (error) {
        console.error("Error fetching geocode data: ", error);
        req.flash("error", "Error fetching location data");
        return res.redirect("/listings/new");
    }
 
    let coordinates = response.data.items.length > 0 ? response.data.items[0].position : { lat: 0, lng: 0 };

    // console.log(coordinates);
    // res.send("done")

        //acsess the image
        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
 

        //to assosiate owner with listings
        newListing.owner = req.user._id;

        newListing.image = {url, filename};

        newListing.coordinates = coordinates;
 
        try {
            await newListing.save();
            req.flash("success", "New Listing Created");
            res.redirect("/listings");
          } catch (err) {
            console.error("Error saving listing: ", err);
            req.flash("error", "Error creating listing");
            res.redirect("/listings/new");
          }
};


module.exports.editListing = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing})
};


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let { location } = req.body.listing;
    console.log(location);

    // Fetch new coordinates based on the updated location
    let geocodeUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(location)}&apiKey=${process.env.MAP_API_KEY}`;
    let response;

    try {
        response = await axios.get(geocodeUrl);
    } catch (error) {
        console.error("Error fetching geocode data: ", error);
        req.flash("error", "Error fetching location data");
        return res.redirect(`/listings/${id}/edit`);
    }

    let coordinates = response.data.items.length > 0 ? response.data.items[0].position : { lat: 0, lng: 0 };
    console.log(coordinates);

    // Find the listing by ID
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    // Update listing fields
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.country = req.body.listing.country;
    listing.location = req.body.listing.location;
    listing.category = req.body.listing.category;
    listing.coordinates = coordinates;

    // Check if a new image was uploaded and update the image fields
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    try {
        // Save the updated listing
        await listing.save();
        req.flash("success", "Listing updated");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error("Error saving listing: ", err);
        req.flash("error", "Error updating listing");
        res.redirect(`/listings/${id}/edit`);
    }
};



module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate:{path: "author"}}).populate("owner");  //populate('reviews') tells Mongoose to replace the reviews field (which contains ObjectIds) with the actual review documents.
    if(!listing){
       req.flash("error", "Listing Not Exist");
       res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing, coordinates: listing.coordinates});
};



module.exports.deleteListing = async (req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    //console.log(deletedListing);
    res.redirect("/listings");
};



module.exports.searchListings = async (req, res) => {
    const { query } = req.query;
    let searchCriteria = {};

    if (query) {
        // Split the query into parts
        const parts = query.split(',').map(part => part.trim());

        if (parts.length === 2) {
            const [location, country] = parts;
            searchCriteria = {
                $and: [
                    { location: { $regex: location, $options: 'i' } },
                    { country: { $regex: country, $options: 'i' } }
                ]
            };
        } else if (parts.length === 1) {
            const singleQuery = parts[0];
            // Search by either location or country
            searchCriteria = {
                $or: [
                    { location: { $regex: singleQuery, $options: 'i' } },
                    { country: { $regex: singleQuery, $options: 'i' } }
                ]
            };
        }
    }

    try {
        const searchResults = await Listing.find(searchCriteria).populate('owner');
        if (searchResults.length === 0) {
            return res.render('listings/noResult', { query });
        }
        res.render('listings/search', { searchResults });
    } catch (err) {
        console.error('Error fetching search results:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





