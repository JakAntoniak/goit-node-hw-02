import { app } from "./app.js";
import { mongoose } from "mongoose";
import { config } from "dotenv";

config();

export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Database connection successful");
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  } catch (err) {
    console.log("Something went wrong! ", err);
    process.exit(1);
  }
};

dbConnect();
