const express = require("express");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error");

const app = express();
const http = require("http").Server(app);
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


// socket io
const socketIO = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:5173",
    },
});

socketIO.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on("message", (data) => {
        console.log(data);
        socketIO.emit("messageResponse", data);
    });

    socket.on("disconnect", () => {
        console.log("🔥: A user disconnected");
    });
});


// import all routes
const user = require("./routes/userRoute");

app.use("/api/v1", user);


// error middleware
app.use(errorMiddleware);


// config.env file
dotenv.config();

// Connect to database
connectDatabase();

const port = process.env.PORT || 9000;

http.listen(port, () => {
    console.log(`Server listening on ${port}`);
});






