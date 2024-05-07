require("dotenv").config();

const express = require("express");
const reviews = require("./routes/reviewsRouter");
const users = require("./routes/userRouter");
const mongoose = require("mongoose");

// express app
const app = express();

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/reviews", reviews);
app.use("/api/user", users);


// 404 error handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Resource not found" });
});

// connect to db
mongoose
  .connect("mongodb+srv://liorsoffer1:1234@cluster0.lrvydhh.mongodb.net/")
  .then(() => {
    console.log("connected to database");
    // listen to port
    app.listen(4000, () => {
      console.log(
        "connect to db & listening for requests on port",
        4000
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
