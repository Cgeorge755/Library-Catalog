import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Libratech</div>
      <div className="nav-links">
        <Link to="/">Catalogue</Link>
        <Link to="/create">Add Book</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;