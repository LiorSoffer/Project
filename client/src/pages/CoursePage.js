// import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const CoursePage = () => {
  const { courseNumber, courseName } = useParams();
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await fetch("https://project-server-virid.vercel.app/api/reviews/course/" + courseNumber);
      const json = await response.json();

      if (response.ok) {
        setReviews(json);
      }
    };

    fetchReviews();
  }, [courseNumber, courseName]);

  return (
    <div>
      <h1>
        {courseName} - {courseNumber}
      </h1>

      {reviews &&
        reviews.map((review) => (
          <div className="course-details" key={review._id}>
            <h2>{review.nickname}</h2>
            <p>Total Rate: {review.grade}</p>
            <p>Year: {review.year}</p>
            <p>Semester: {review.semester}</p>
            <p>Hard: {review.hard}</p>
            <p>Interest: {review.intrest}</p>
            <p>Effort: {review.effort}</p>
            <p>Relevant: {review.relevant}</p>
            <p>{review.comment}</p>
          </div>
        ))}
    </div>
  );
};

export default CoursePage;
