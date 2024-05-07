const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    courseNumber: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    counter: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("course", courseSchema);
