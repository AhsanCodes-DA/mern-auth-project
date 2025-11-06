 import mongoose from "mongoose";

 const connectDB = async() => {

     mongoose.connection.on('connected', () => console.log("database connected"));

     await mongoose.connect(`${process.env.MONGODB_URL}/mern-auth`);

 }

 export default connectDB;




 /*
 const connectDB = () => {
   // Event listener for successful connection
   mongoose.connection.on('connected', () => {
     console.log("database connected");
   });

   // Connect to the database
   mongoose.connect(`${process.env.MONGODB_URL}/mern-auth`)
     .then(() => {
       console.log("Connected to the database successfully!");
     })
     .catch((error) => {
       console.error("Failed to connect to the database:", error);
     });
 };

 export default connectDB;  */