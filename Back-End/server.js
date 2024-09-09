import  express  from "express"
import dotenv from "dotenv";
import path from "path";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRouter.js"
import messageRoutes from "./routes/messageRouter.js"
import {v2 as cloudinary} from "cloudinary";
import {app, server} from "./socket/socket.js";
import job from "./utils/cron.js";

dotenv.config();
connectDB();

job.start();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET,
})

app.use(express.json({limit:"50mb"})); // To parse JSON data in the req.body
app.use(express.urlencoded({extended: true})); // To parse object or nasted object the req.body
// app.use(express.urlencoded({extended: false})); TO parse string or arrays.
app.use(cookieParser()); // get cookie from req set cookie inside req

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/messages", messageRoutes)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/Front-End/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "Front-End", "dist", "index.html"));
    })
}

server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));




