import { useEffect, useState } from "react";

// components
import CourseDetails from "../components/CourseDetails";
import ReviewForm from "../components/ReviewForm";

function Home() {
  const [courses, setCourses] = useState(null);

  const fetchCourses = async () => {
    const response = await fetch("/api/reviews/courses/");
    const json = await response.json();

    if (response.ok) {
      setCourses(json);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="home">
      <div className="courses">
        {courses &&
          courses.map((course) => (
            <CourseDetails course={course} key={course._id} />
          ))}
      </div>
      <ReviewForm fetchCourses={fetchCourses} />
    </div>
  );
}

export default Home;
