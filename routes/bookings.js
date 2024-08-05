const express = require('express');
const router = express.Router();
const Listing = require('../Models/listing');
const Booking = require('../Models/booking');
const { isLoggedIn, isOwner,} = require('../middleware');


//router.use(setUser);

// Route to create a new booking
router.post('/listings/:id/bookings', isLoggedIn, async (req, res) => {

    const user = req.user;
    const listingId = req.params.id;
    const { checkin, checkout, guests } = req.body;

     // Ensure that the check-in and check-out dates are valid
     if (!checkin || !checkout || new Date(checkin) >= new Date(checkout)) {
        req.flash('error', 'Invalid check-in or check-out dates.');
        return res.redirect(`/listings/${listingId}`);
    }


     // Ensure dates are in the future
     const now = new Date();
     if (new Date(checkin) < now || new Date(checkout) < now) {
         req.flash('error', 'Check-in and check-out dates must be in the future.');
         return res.redirect(`/listings/${listingId}`);
     }


   const listing = await Listing.findById(listingId); 
   // Use the static method to check if the listing is available for the given dates
   const isAvailable = await Booking.isBookingAvailable(listingId, new Date(checkin), new Date(checkout));
   if (!isAvailable) {
      
       req.flash('error', 'The listing is already booked for the selected dates.');
       return res.redirect(`/listings/${listingId}`);
   }


   // Create and save the booking
    const booking = new Booking({
        listing: listing._id,
        user: user._id,
        checkin,
        checkout,
        guests
    });

    await booking.save();

    // Add the booking to the listing's bookings array
    listing.bookings.push(booking);
    await listing.save();
    
    req.flash('success', 'Booking successful!');
    res.redirect(`/listings/${listing._id}`);
});


//show booking
router.get('/bookings', isLoggedIn, async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate('listing');
    res.render('bookings/index', { bookings, user: req.user });
});


// Route to cancel a booking
router.post('/bookings/:id/cancel', isLoggedIn, async (req, res) => {
    const bookingId = req.params.id;
    const user = req.user;

    try {
        const booking = await Booking.findById(bookingId);
        // if (!booking) {
        //     req.flash('error', 'Booking not found.');
        //     return res.redirect('/');
        // }

        if (!booking.user.equals(user._id)) {
            req.flash('error', 'You do not have permission to cancel this booking.');
            return res.redirect('/listings');
        }

        booking.cancelled = true;
        await booking.save();

        req.flash('success', 'Booking cancelled successfully.');
        res.redirect(`/listings/${booking.listing}`);
    } catch (error) {
        console.error('Error cancelling booking:', error);
        req.flash('error', 'An error occurred while cancelling your booking.');
        res.redirect('/');
    }
});

//delete booking details
router.delete('/bookings/:id', async (req, res) => {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    req.flash("success", "Booking Detail Deleted");
    res.redirect('/bookings');
});



//owner dashboard
router.get('/bookings/dashboard', isLoggedIn, async (req, res) => {
    try {
         // Fetch listings where the owner is the currently logged-in user
         const listings = await Listing.find({ owner: req.user._id })
         .populate({
             path: 'bookings',
             match: { cancelled: false }, // Only populate non-cancelled bookings
         });

        res.render('bookings/dashboard', { listings });
    } catch (err) {
        console.error('Error fetching listings for owner:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

