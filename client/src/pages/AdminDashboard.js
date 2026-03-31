import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/Axios";

function AdminDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [books, setBooks] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    try {
      const [booksRes, rentalsRes, usersRes] = await Promise.all([
        API.get("/books/"),
        API.get("/rentals/"),
        API.get("/users/")
      ]);

      setBooks(booksRes.data);
      setRentals(rentalsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Error loading admin data:", error);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchData();
    }
  }, []);

  const handleDeleteBook = async (id) => {
    try {
      await API.delete(`/books/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.detail || "Could not delete book");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.detail || "Could not delete user");
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="form-page">
        <h2>Access denied. Admin only.</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Admin Dashboard</h1>

      <div className="admin-section">
        <h2>All Rented Books</h2>
        {rentals.length === 0 ? (
          <p>No rentals found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Book</th>
                  <th>Rented On</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((rental) => (
                  <tr key={rental.id}>
                    <td>{rental.user_name}</td>
                    <td>{rental.book_title}</td>
                    <td>{rental.rented_on}</td>
                    <td>{rental.due_date}</td>
                    <td>{rental.returned ? "Returned" : "Active"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-section">
        <h2>Manage Books</h2>
        {books.length === 0 ? (
          <p>No books found.</p>
        ) : (
          <div className="card-grid">
            {books.map((book) => (
              <div className="card" key={book.id}>
                {book.image_url && (
                  <img src={book.image_url} alt={book.title} className="book-cover" />
                )}
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Copies:</strong> {book.copies_available}</p>

                <div className="card-actions">
                  <Link to={`/modify/${book.id}`} className="btn secondary">
                    Edit
                  </Link>
                  <button
                    className="btn danger"
                    onClick={() => handleDeleteBook(book.id)}
                  >
                    Remove Damaged/Lost
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="admin-section">
        <h2>Manage User Accounts</h2>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.email !== "admin@libratech.com" && (
                        <button
                          className="btn danger"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Remove User
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;