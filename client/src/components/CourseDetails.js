import { Link } from "react-router-dom";

const CourseDetails = ({ course }) => {
  return (
    <div className="course-details1 course-details">
      <Link
        to={`/courses/${course.courseNumber}/${course.courseName}`}
        style={{ textDecoration: "none" }}
      >
        <h4>{course.courseName}</h4>
        <p>
          <strong> Course Number: </strong>
          {course.courseNumber}
        </p>
        <p>
          <strong>Avarage Rate: </strong>
          {course.grade}
        </p>
      </Link>
    </div>
  );
};

export default CourseDetails;
