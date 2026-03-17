import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/Axios";

function Create() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    publication_year: "",
    publisher: "",
    copies_available: "",
    description: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/books", {
        ...form,
        publication_year: Number(form.publication_year),
        copies_available: Number(form.copies_available)
      });
      navigate("/");
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };

  return (
    <div className="form-page">
      <h1>Add Book</h1>
      <form className="book-form" onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <input name="author" placeholder="Author" onChange={handleChange} required />
        <input name="isbn" placeholder="ISBN" onChange={handleChange} required />
        <input name="genre" placeholder="Genre" onChange={handleChange} required />
        <input name="publication_year" type="number" placeholder="Publication Year" onChange={handleChange} required />
        <input name="publisher" placeholder="Publisher" onChange={handleChange} required />
        <input name="copies_available" type="number" placeholder="Copies Available" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <button type="submit" className="btn primary">Create Book</button>
      </form>
    </div>
  );
}

export default Create;