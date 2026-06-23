const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/netflix_recommendation";
    await mongoose.connect(uri);
    console.log("MongoDB connected");

    const db = mongoose.connection.db;
    const usersCollection = await db.listCollections({ name: "users" }).toArray();
    if (usersCollection.length > 0) {
      const collection = db.collection("users");
      const hasUsernameIndex = await collection.indexExists("username_1");
      if (hasUsernameIndex) {
        await collection.dropIndex("username_1");
        console.log("Dropped stale username_1 index from users collection");
      }
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
