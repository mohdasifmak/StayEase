const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Models/listing.js");

main()
.then(()=>{
    console.log("connected to database");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
  await Listing.deleteMany({});

  //attach owners with every listings
  initData.data = initData.data.map((obj) => ({...obj, owner: "6657005b026d8ffe4dc2cd80"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
}

initDB();