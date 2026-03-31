import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/Axios";

function Home() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [order, setOrder] = useState("asc");

  const fetchBooks = async () => {
    try {
      const response = await API.get("/books/", {
        params: { search, sort_by: sortBy, order }
      });
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search, sortBy, order]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/books/${id}`);
      fetchBooks();
    } catch (error) {
      alert(error.response?.data?.detail || "Could not delete book");
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Libratech Book Catalogue</h1>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by title, author, genre, ISBN, or publisher"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="genre">Genre</option>
          <option value="publisher">Publisher</option>
          <option value="publication_year">Publication Year</option>
          <option value="copies_available">Copies Available</option>
        </select>

        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="card-grid">
        {books.length === 0 ? (
          <p>No books found.</p>
        ) : (
          books.map((book) => (
            <div className="card" key={book.id}>
              {book.image_url && (
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="book-cover"
                />
              )}

              <h2>{book.title}</h2>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>ISBN:</strong> {book.isbn}</p>
              <p><strong>Genre:</strong> {book.genre}</p>
              <p><strong>Year:</strong> {book.publication_year}</p>
              <p><strong>Publisher:</strong> {book.publisher}</p>
              <p><strong>Description:</strong> {book.description}</p>
              <p>
                <strong>Availability:</strong>{" "}
                <span className={book.copies_available > 0 ? "status-available" : "status-unavailable"}>
                  {book.copies_available > 0 ? "Available" : "Not Available"}
                </span>
              </p>
              <p><strong>Copies Available:</strong> {book.copies_available}</p>

              <div className="card-actions">
                {currentUser?.role === "user" && (
                  <Link
                    to={`/rent/${book.id}`}
                    className={`btn primary ${book.copies_available <= 0 ? "disabled-link" : ""}`}
                  >
                    Rent Book
                  </Link>
                )}

                {currentUser?.role === "admin" && (
                  <>
                    <Link to={`/modify/${book.id}`} className="btn secondary">
                      Edit
                    </Link>
                    <button className="btn danger" onClick={() => handleDelete(book.id)}>
                      Delete
                    </button>
                  </>
                )}

                {!currentUser && (
                  <p className="muted-note">Login to interact with books</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;