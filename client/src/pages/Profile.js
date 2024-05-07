import { useEffect, useState } from "react";


const Profile = () => {
  const [reviews, setReviews] = useState(null);
  let user = JSON.parse(localStorage.getItem("user"));

  const fetchReviews = async () => {
    const response = await fetch("https://project-server-virid.vercel.apphttps://project-server-virid.vercel.app/api/reviews/user/" + user.email);

    const json = await response.json();
    if (response.ok) {
      setReviews(json);
    }
  };

  useEffect(() => {
    user = JSON.parse(localStorage.getItem("user"));
    fetchReviews();
  }, []);

  const handleDelete = async (review) => {
    if (!user) {
      return;
    }

    const response = await fetch("https://project-server-virid.vercel.apphttps://project-server-virid.vercel.app/api/reviews/" + review._id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    //const json = await response.json();
    if (response.ok) {
      fetchReviews();
    }
  };

  return (
    <div>
      <h1>Hello {user.email.substring(0, user.email.indexOf("@"))}</h1>

      {reviews === null ? (
        <p>Loading...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <>
          <h2>Your Reviews:</h2>
          {reviews.map((review) => (
            <div className="course-details" id={review._id} key={review._id}>
              <h2>
                Course: {review.courseName} - {review.courseNumber}{" "}
              </h2>
              <strong>
                <p>Total Rate: {review.grade}</p>
              </strong>
              <p>Year: {review.year}</p>
              <p>Semester: {review.semester}</p>
              <p>Hard: {review.hard}</p>
              <p>Interest: {review.intrest}</p>
              <p>Effort: {review.effort}</p>
              <p>Relevant: {review.relevant}</p>
              <p>{review.comment}</p>

              <span
                onClick={() => handleDelete(review)}
                className="material-symbols-outlined"
                style={{ position: "absolute", top: "20px", padding: "10px" }}
              >
                delete
              </span>
              {/* <span
                className="material-symbols-outlined"
                style={{ position: "absolute", top: "70px", padding: "10px" }}
              >
                edit
              </span> */}
            </div>
          ))}
        </>
      )}
    </div>
  );
};
export default Profile;
