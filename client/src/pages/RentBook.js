import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../utils/Axios";

function RentBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [book, setBook] = useState(null);
  const [rentalDays, setRentalDays] = useState(1);

  const costPerDay = 2.5;
  const totalCost = rentalDays * costPerDay;

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await API.get(`/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };

    if (!currentUser || currentUser.role !== "user") {
      navigate("/login");
      return;
    }

    fetchBook();
  }, [id, currentUser, navigate]);

  const handleCheckout = async () => {
    try {
      await API.post("/rentals", {
        user_id: currentUser.id,
        user_name: currentUser.name,
        book_id: book.id,
        rental_days: rentalDays
      });

      alert("Book rented successfully");
      navigate("/my-rentals");
    } catch (error) {
      alert(error.response?.data?.detail || "Could not rent book");
    }
  };

  if (!book) {
    return <div className="form-page"><h2>Loading...</h2></div>;
  }

  return (
    <div className="rent-page">
      <div className="rent-card">
        <div className="rent-image-wrap">
          {book.image_url && (
            <img
              src={book.image_url}
              alt={book.title}
              className="rent-book-cover"
            />
          )}
        </div>

        <div className="rent-details">
          <h1>Rent Book</h1>
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Available Copies:</strong> {book.copies_available}</p>

          <label className="rent-label">Select rental days:</label>
          <input
            type="number"
            min="1"
            value={rentalDays}
            onChange={(e) => setRentalDays(Number(e.target.value))}
            className="rent-input"
          />

          <div className="rent-summary">
            <p><strong>Cost per day:</strong> ${costPerDay.toFixed(2)}</p>
            <p><strong>Total cost:</strong> ${totalCost.toFixed(2)}</p>
          </div>

          <button className="btn primary" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default RentBook;