StayEase

StayEase is a web application designed to streamline the process of finding and booking accommodations. It offers users an intuitive platform to browse listings, make reservations, and manage their stays with ease.


Features

User Authentication: Secure sign-up and login functionalities.

Property Listings: Browse through a variety of accommodation options.

Booking System: Reserve properties with real-time availability checks.

Image Uploads: Property owners can upload images to showcase their listings.

Responsive Design: Optimized for both desktop and mobile devices.


Technologies Used

Frontend:

HTML, CSS, JavaScript

EJS Templating Engine


Backend:

Node.js

Express.js


Database:

MongoDB


File Uploads:

Multer

Cloudinary


Authentication:

Passport.js


Others:

Mongoose for MongoDB object modeling

Installation
Clone the repository:
cd StayEase

Install dependencies:
npm install


Set up environment variables: Create a .env file in the root directory and add the following:

PORT=3000

MONGODB_URI=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

SESSION_SECRET=your_session_secret

Run the application:


node app.js

Application is start.
