import  express  from "express"
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRouter.js"
import {v2 as cloudinary} from "cloudinary";

dotenv.config();
connectDB();
const app = express();

const PORT = process.env.PORT || 5000;

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET,
})

app.use(express.json()); // To parse JSON data in the req.body
app.use(express.urlencoded({extended: true})); // To parse object or nasted object the req.body
// app.use(express.urlencoded({extended: false})); TO parse string or arrays.
app.use(cookieParser()); // get cookie from req set cookie inside req

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));




