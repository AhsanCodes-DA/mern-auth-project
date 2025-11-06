import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongoDB.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";

const app = express();

const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ['http://localhost:5173'] // frontend link for backend to link with can add more frontend link here



// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to enable CORS
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Logging middleware (moved after express.json())
app.use((req, res, next) => {
    console.log('Request Body:', req.body);
    next();
});

// Routes
app.get('/', (req, res) => res.send("API is WORKING"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Start the server
app.listen(port, () => console.log(`server started on port:${port}`));