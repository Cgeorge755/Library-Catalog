import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">Libratech</div>

      <div className="nav-links">
        <Link to="/">Catalogue</Link>

        {currentUser?.role === "user" && (
          <Link to="/my-rentals">My Rentals</Link>
        )}

        {currentUser?.role === "admin" && (
          <>
            <Link to="/create">Add Book</Link>
            <Link to="/admin">Admin Dashboard</Link>
          </>
        )}

        {!currentUser ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span className="nav-user-label">
              {currentUser.name} ({currentUser.role})
            </span>
            <button onClick={handleLogout} className="btn nav-logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;