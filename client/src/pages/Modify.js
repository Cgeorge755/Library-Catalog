import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../utils/Axios";

function Modify() {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await API.get(`/books/${id}`);
        setForm(response.data);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/books/${id}`, {
        ...form,
        publication_year: Number(form.publication_year),
        copies_available: Number(form.copies_available)
      });
      navigate("/");
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  return (
    <div className="form-page">
      <h1>Modify Book</h1>
      <form className="book-form" onSubmit={handleSubmit}>
        <input name="title" value={form.title} placeholder="Title" onChange={handleChange} required />
        <input name="author" value={form.author} placeholder="Author" onChange={handleChange} required />
        <input name="isbn" value={form.isbn} placeholder="ISBN" onChange={handleChange} required />
        <input name="genre" value={form.genre} placeholder="Genre" onChange={handleChange} required />
        <input name="publication_year" type="number" value={form.publication_year} placeholder="Publication Year" onChange={handleChange} required />
        <input name="publisher" value={form.publisher} placeholder="Publisher" onChange={handleChange} required />
        <input name="copies_available" type="number" value={form.copies_available} placeholder="Copies Available" onChange={handleChange} required />
        <textarea name="description" value={form.description} placeholder="Description" onChange={handleChange} required />
        <button type="submit" className="btn primary">Update Book</button>
      </form>
    </div>
  );
}

export default Modify;
