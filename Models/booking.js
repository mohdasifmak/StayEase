const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    checkin: {
        type: Date,
        required: true
    },
    checkout: {
        type: Date,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    cancelled: { // New field
        type: Boolean,
        default: false
    }
});


// Static method to check if a booking is available for given dates
bookingSchema.statics.isBookingAvailable = async function (listingId, checkin, checkout) {
    // Check for overlapping bookings
    const existingBookings = await this.find({
        listing: listingId,
        cancelled: false,
        checkin: { $lt: checkout },    // Start date of existing booking is before end date of requested booking
        checkout: { $gt: checkin }     // End date of existing booking is after start date of requested booking
    });

    // Return true if no existing bookings overlap, otherwise false
    return existingBookings.length === 0;
};


const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;

