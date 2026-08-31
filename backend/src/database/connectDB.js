import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Verbindung mit Datenbank hat geklappt");
  } catch (error) {
    console.error("MongoDB Verbindung fehlgeschlagen:", error.message);
    process.exit(1);
  }
};

export default connectDB;
