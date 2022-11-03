const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");

feedRoutes = require("./routes/feed");
authRoutes = require("./routes/auth");

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        const currentDate = new Date().toISOString();
        const customizedDate =
            currentDate.replace(/:/g, "-") + "-" + file.originalname;
        cb(null, customizedDate);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(bodyParser.json());
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});


app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data : data
    });
});

mongoose
    .connect(
        "mongodb+srv://Mego-read:SmwVUeUGPZKEdniD@cluster0.gxubn.mongodb.net/messages?retryWrites=true&w=majority"
    )
    .then((res) => {
        const server = app.listen(5000);
        const io = require("./socket").init(server);
        io.on('connection', socket => {
            // console.log("dart ya seya3");
        })
    })
    .catch((err) => {
        console.log(err);
    });
