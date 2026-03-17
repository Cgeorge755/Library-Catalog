import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/Axios";

function Home() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [order, setOrder] = useState("asc");

  const fetchBooks = async () => {
    try {
      const response = await API.get("/books", {
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
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="container">
      <h1>Libratech Book Catalogue</h1>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by title, author, genre, isbn, publisher"
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
        {books.map((book) => (
          <div className="card" key={book.id}>
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>ISBN:</strong> {book.isbn}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Year:</strong> {book.publication_year}</p>
            <p><strong>Publisher:</strong> {book.publisher}</p>
            <p><strong>Copies:</strong> {book.copies_available}</p>
            <p><strong>Description:</strong> {book.description}</p>

            <div className="card-actions">
              <Link to={`/modify/${book.id}`} className="btn secondary">Edit</Link>
              <button className="btn danger" onClick={() => handleDelete(book.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;