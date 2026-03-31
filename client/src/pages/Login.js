import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/Axios";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/users/login", form);
      localStorage.setItem("currentUser", JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="form-page">
      <h1>Libratech Login</h1>

      <form className="book-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn primary">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;