const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

const connectDB = async () => {
  try {
    console.log("Connecting to Mongo...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });

    console.log("MongoDB Connected");
  } catch (err) {
    console.error("DB ERROR:", err.message);
  }
};

module.exports = connectDB;