import { useEffect, useState } from "react";
import API from "../utils/Axios";

function MyRentals() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [rentals, setRentals] = useState([]);

  const fetchRentals = async () => {
    try {
      const response = await API.get(`/rentals/user/${currentUser.id}`);
      setRentals(response.data);
    } catch (error) {
      console.error("Error fetching rentals:", error);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "user") {
      fetchRentals();
    }
  }, []);

  const handleReturn = async (rentalId) => {
    try {
      await API.put(`/rentals/${rentalId}/return`);
      fetchRentals();
    } catch (error) {
      alert(error.response?.data?.detail || "Could not return book");
    }
  };

  const getDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (!currentUser || currentUser.role !== "user") {
    return <div className="form-page"><h2>Access denied.</h2></div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">My Rentals</h1>

      {rentals.length === 0 ? (
        <p>No rented books yet.</p>
      ) : (
        <div className="card-grid">
          {rentals.map((rental) => {
            const daysLeft = getDaysLeft(rental.due_date);

            return (
              <div
                className={`card ${
                  rental.returned
                    ? "returned-card"
                    : daysLeft < 0
                    ? "overdue-card"
                    : daysLeft <= 2
                    ? "due-soon-card"
                    : ""
                }`}
                key={rental.id}
              >
                {rental.book_image_url && (
                  <img
                    src={rental.book_image_url}
                    alt={rental.book_title}
                    className="book-cover"
                  />
                )}

                <h2>{rental.book_title}</h2>
                <p><strong>Rental Days:</strong> {rental.rental_days}</p>
                <p><strong>Rented On:</strong> {rental.rented_on}</p>
                <p><strong>Due Date:</strong> {rental.due_date}</p>
                <p><strong>Total Cost:</strong> ${rental.total_cost.toFixed(2)}</p>

                <p>
                  <strong>Status:</strong>{" "}
                  {rental.returned ? (
                    <span className="status-returned">Returned</span>
                  ) : daysLeft < 0 ? (
                    <span className="status-overdue">Overdue</span>
                  ) : daysLeft <= 2 ? (
                    <span className="status-due-soon">Due Soon</span>
                  ) : (
                    <span className="status-active">Active</span>
                  )}
                </p>

                {!rental.returned && (
                  <>
                    <p><strong>Days Left:</strong> {daysLeft >= 0 ? daysLeft : 0}</p>

                    {daysLeft <= 2 && daysLeft >= 0 && (
                      <p className="due-soon-text">
                        Reminder: Return this book soon
                      </p>
                    )}

                    {daysLeft < 0 && (
                      <p className="overdue-text">
                        This book is overdue
                      </p>
                    )}

                    <button className="btn secondary" onClick={() => handleReturn(rental.id)}>
                      Return Book
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyRentals;