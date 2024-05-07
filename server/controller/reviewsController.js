const Review = require("../models/reviewModel");
const Course = require("../models/courseModel");
const mongoose = require("mongoose");

// get all courses
const getCourses = async (req, res) => {
  const courses = await Course.find({}).sort({ grade: -1 });

  res.status(200).json(courses);
};

// get all reviews
const getReviews = async (req, res) => {
  const reviews = await Review.find({}).sort({ createdAt: -1 });

  res.status(200).json(reviews);
};
//GET reviews of specific course
const getReviewsByCourse = async (req, res) => {
  const { courseNum } = req.params;

  // if (!mongoose.Types.ObjectId.isValid(courseNum)) {
  //   return res.status(404).json({error: 'No such review'})
  // }

  const reviews = await Review.find({ courseNumber: courseNum });

  if (reviews.length == 0) {
    return res.status(404).json({ error: "No reviews for this course number" });
  }

  res.status(200).json(reviews);
};

//GET reviews of specific user
const getReviewsByNickName = async (req, res) => {
  const { nickname } = req.params;

  const reviews = await Review.find({ nickname: nickname }).sort({
    createdAt: -1,
  });

  res.status(200).json(reviews);
};

// get a single review
const getReview = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such review" });
  }

  const review = await Review.findById(id);

  if (!review) {
    return res.status(404).json({ error: "No such review" });
  }

  res.status(200).json(review);
};

// create a new review for new course
const createReviewNewCourse = async (req, res) => {
  const {
    nickname,
    courseNumber,
    courseName,
    year,
    semester,
    hard,
    intrest,
    effort,
    relevant,
    grade,
    comment,
  } = req.body;

  // add to the database
  try {
    const review = await Review.create({
      nickname,
      courseNumber,
      courseName,
      year,
      semester,
      hard,
      intrest,
      effort,
      relevant,
      grade,
      comment,
    });

    let counter = 1;
    const newCourse = await Course.create({
      courseNumber,
      courseName,
      grade,
      counter,
    });

    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// create a new review for exists course
const createReview = async (req, res) => {
  const {
    nickname,
    courseNumber,
    courseName,
    year,
    semester,
    hard,
    intrest,
    effort,
    relevant,
    grade,
    comment,
  } = req.body;

  const myReview = await Review.findOne({
    courseNumber: courseNumber,
    nickname: nickname,
  });

  if (myReview) {
    console.log(myReview);
    return res.status(400).json({ error: "You already commented this course" });
  }

  try {
    const review = await Review.create({
      nickname,
      courseNumber,
      courseName,
      year,
      semester,
      hard,
      intrest,
      effort,
      relevant,
      grade,
      comment,
    });

    const course = await Course.findOne({ courseNumber: courseNumber });
    let counter = parseFloat(course.counter);
    let newGrade = parseFloat(course.grade);
    newGrade = (newGrade * counter + parseFloat(grade)) / (counter + 1);
    const updatedCourse = await Course.findOneAndUpdate(
      { courseNumber: courseNumber },
      {
        counter: ++course.counter,
        grade: newGrade.toString(),
      }
    );

    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a review
const deleteReview = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such review" });
  }

  const review = await Review.findOneAndDelete({ _id: id });

  if (!review) {
    return res.status(400).json({ error: "No such review" });
  }

  const course = await Course.findOne({ courseNumber: review.courseNumber });
  let counter = parseFloat(course.counter);
  if (counter == 1) {
    await Course.findOneAndDelete({ courseNumber: review.courseNumber });
    res.status(200).json(review);
  } else {
    let newGrade = parseFloat(course.grade);
    newGrade = (newGrade * counter - parseFloat(review.grade)) / (counter - 1);
    const updatedCourse = await Course.findOneAndUpdate(
      { courseNumber: review.courseNumber },
      {
        counter: --course.counter,
        grade: newGrade.toString(),
      }
    );
    res.status(200).json(review);
  }
};
const deleteAllReviews = async (req, res) => {
  await Review.deleteMany({});
  return res.status(200).json({ mssg: "all deleted" });
};

// update a review
const updateReview = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such review" });
  }
  const oldReview = await Review.findOne({ _id: id });
  const review = await Review.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!review) {
    return res.status(400).json({ error: "No such review" });
  }
  if (req.body.grade != undefined) {
    const course = await Course.findOne({ courseNumber: review.courseNumber });
    let newGrade = parseFloat(course.grade);
    newGrade =
      (newGrade * course.counter -
        parseFloat(oldReview.grade) +
        parseFloat(req.body.grade)) /
      course.counter;
    const updatedCourse = await Course.findOneAndUpdate(
      { courseNumber: review.courseNumber },
      {
        grade: newGrade.toString(),
      }
    );
  }
  res.status(200).json(review);
};

module.exports = {
  getCourses,
  getReviews,
  getReviewsByCourse,
  getReviewsByNickName,
  getReview,
  createReview,
  createReviewNewCourse,
  deleteReview,
  deleteAllReviews,
  updateReview,
};
