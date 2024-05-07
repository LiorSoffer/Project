import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const ReviewForm = ({ fetchCourses }) => {
  const { user } = useAuthContext();

  const [courseNumber, setCourseNumber] = useState("");
  const [courseName, setCourseName] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("א");
  const [hard, setHard] = useState("1");
  const [intrest, setIntrest] = useState("1");
  const [effort, setEffort] = useState("1");
  const [relevant, setRelevant] = useState("1");
  const [grade, setGrade] = useState("1");
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const responseC = await fetch("https://project-server-virid.vercel.app/api/reviews/courses/");
    const jsonC = await responseC.json();
    let createUrl = "https://project-server-virid.vercel.app/api/reviews/new";
    let realCourseName = courseName;
    if (responseC.ok) {
      let found = false;
      let index = 0;
      for (let i = 0; i < jsonC.length && !found; i++) {
        found = jsonC[i].courseNumber === courseNumber;
        index = i;
      }
      if (found) {
        realCourseName = jsonC[index].courseName;
        createUrl = "https://project-server-virid.vercel.app/api/reviews/exist";
      }
    }

    const review = {
      nickname: user.email,
      courseNumber,
      courseName: realCourseName,
      year,
      semester,
      hard,
      intrest,
      effort,
      relevant,
      grade,
      comment,
    };

    const response = await fetch(createUrl, {
      method: "POST",
      body: JSON.stringify(review),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setError(null);
      setCourseNumber("");
      setCourseName("");
      setYear("");
      setSemester("A");
      setHard("1");
      setIntrest("1");
      setEffort("1");
      setRelevant("1");
      setGrade("1");
      setComment("");
      console.log("new review added:", json);
    }
    fetchCourses();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a new review</h3>
      <label>Course Number:</label>
      <input
        type="number"
        required
        value={courseNumber}
        onChange={(e) => setCourseNumber(e.target.value)}
      />
      <label>Course Name:</label>
      <input
        type="text"
        required
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
      ></input>
      <label>Year Taken:</label>
      <input
        type="number"
        required
        min="1969"
        max="2050"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      ></input>
      <label>Semester:</label>
      <select value={semester} onChange={(e) => setSemester(e.target.value)}>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>
      <label>Difficulty:</label>
      <div className="inline-options">
        {[1, 2, 3, 4, 5].map((value) => (
          <label key={value} className="radio-label">
            <input
              type="radio"
              value={value}
              checked={parseInt(hard) === value}
              onChange={(e) => setHard(e.target.value)}
            />
            {value}
          </label>
        ))}
      </div>
      <label>Interest Level:</label>
      <div className="inline-options">
        {[1, 2, 3, 4, 5].map((value) => (
          <label key={value} className="radio-label">
            <input
              type="radio"
              value={value}
              checked={parseInt(intrest) === value}
              onChange={(e) => setIntrest(e.target.value)}
            />
            {value}
          </label>
        ))}
      </div>
      <label>Effort Level:</label>
      <div className="inline-options">
        {[1, 2, 3, 4, 5].map((value) => (
          <label key={value} className="radio-label">
            <input
              type="radio"
              value={value}
              checked={parseInt(effort) === value}
              onChange={(e) => setEffort(e.target.value)}
            />
            {value}
          </label>
        ))}
      </div>
      <label> Relevant To Real Life:</label>
      <div className="inline-options">
        {[1, 2, 3, 4, 5].map((value) => (
          <label key={value} className="radio-label">
            <input
              type="radio"
              value={value}
              checked={parseInt(relevant) === value}
              onChange={(e) => setRelevant(e.target.value)}
            />
            {value}
          </label>
        ))}
      </div>
      <label>Total Rate Of The Course: </label>
      <div className="inline-options">
        {[1, 2, 3, 4, 5].map((value) => (
          <label key={value} className="radio-label">
            <input
              type="radio"
              value={value}
              checked={parseInt(grade) === value}
              onChange={(e) => setGrade(e.target.value)}
            />
            {value}
          </label>
        ))}
      </div>
      <label>Personal Opinion:</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <br />
      <button>Add Review</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default ReviewForm;
