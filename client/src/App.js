import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Modify from "./pages/Modify";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RentBook from "./pages/RentBook";
import MyRentals from "./pages/MyRentals";
import AdminDashboard from "./pages/AdminDashboard";
import Reports from "./pages/Reports";
import Navbar from "./components/Navbar";
import "./index.css";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<Create />} />
                <Route path="/modify/:id" element={<Modify />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/rent/:id" element={<RentBook />} />
                <Route path="/my-rentals" element={<MyRentals />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/reports" element={<Reports />} />
            </Routes>
        </Router>
    );
}

export default App;