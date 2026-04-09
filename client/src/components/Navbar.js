import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/Axios";

function Navbar() {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const [notifications, setNotifications] = useState([]);
    const [panelOpen, setPanelOpen] = useState(false);

    useEffect(() => {
        if (currentUser?.role === "user") {
            fetchNotifications();
        }
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await API.get(`/rentals/user/${currentUser.id}`);
            const today = new Date();
            const alerts = response.data
                .filter(r => !r.returned)
                .map(r => ({
                    ...r,
                    daysLeft: Math.ceil((new Date(r.due_date) - today) / (1000 * 60 * 60 * 24))
                }))
                .filter(r => r.daysLeft <= 3)
                .sort((a, b) => a.daysLeft - b.daysLeft);
            setNotifications(alerts);
        } catch (err) {
            console.error("Could not fetch notifications", err);
        }
    };

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
                        <Link to="/reports">Reports</Link>
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

                        {/* Notification Bell — users only */}
                        {currentUser.role === "user" && (
                            <div style={{ position: "relative" }}>
                                <button
                                    onClick={() => setPanelOpen(prev => !prev)}
                                    className="btn nav-logout-btn"
                                    style={{ fontSize: "16px", padding: "6px 10px" }}
                                    title="Notifications"
                                >
                                    🔔
                                    {notifications.length > 0 && (
                                        <span style={{
                                            position: "absolute", top: "-4px", right: "-4px",
                                            background: "#dc2626", color: "white",
                                            fontSize: "10px", fontWeight: "bold",
                                            borderRadius: "50%", width: "16px", height: "16px",
                                            display: "flex", alignItems: "center", justifyContent: "center"
                                        }}>
                                            {notifications.length}
                                        </span>
                                    )}
                                </button>

                                {panelOpen && (
                                    <div style={{
                                        position: "absolute", top: "calc(100% + 10px)", right: 0,
                                        width: "300px", background: "white", borderRadius: "12px",
                                        boxShadow: "0 8px 32px rgba(0,0,0,0.18)", zIndex: 1000,
                                        overflow: "hidden"
                                    }}>
                                        <div style={{ background: "#0f172a", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}>
                                                Notifications {notifications.length > 0 && `(${notifications.length})`}
                                            </span>
                                            <button onClick={() => setPanelOpen(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "16px" }}>✕</button>
                                        </div>

                                        {notifications.length === 0 ? (
                                            <div style={{ padding: "24px 16px", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
                                                <div style={{ fontSize: "26px", marginBottom: "8px" }}>✅</div>
                                                No upcoming due dates. You're all good!
                                            </div>
                                        ) : (
                                            <div style={{ maxHeight: "340px", overflowY: "auto" }}>
                                                {notifications.map((n, i) => {
                                                    const isOverdue = n.daysLeft < 0;
                                                    const color = isOverdue || n.daysLeft === 0 ? "#dc2626" : "#d97706";
                                                    const bg    = isOverdue || n.daysLeft === 0 ? "#fef2f2" : "#fffbeb";
                                                    const icon  = isOverdue ? "🚨" : "⚠️";
                                                    const label = isOverdue
                                                        ? `Overdue by ${Math.abs(n.daysLeft)} day${Math.abs(n.daysLeft) !== 1 ? "s" : ""}`
                                                        : n.daysLeft === 0 ? "Due today!"
                                                            : `Due in ${n.daysLeft} day${n.daysLeft !== 1 ? "s" : ""}`;

                                                    return (
                                                        <div key={i} onClick={() => { navigate("/my-rentals"); setPanelOpen(false); }}
                                                             style={{ padding: "12px 16px", borderBottom: i < notifications.length - 1 ? "1px solid #f1f5f9" : "none", background: bg, cursor: "pointer" }}>
                                                            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                                                <span style={{ fontSize: "16px" }}>{icon}</span>
                                                                <div>
                                                                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#1f2937", marginBottom: "2px" }}>
                                                                        {n.book_title.length > 33 ? n.book_title.slice(0, 33) + "…" : n.book_title}
                                                                    </div>
                                                                    <div style={{ fontSize: "12px", color, fontWeight: "bold" }}>{label}</div>
                                                                    <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Due: {n.due_date}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        <div onClick={() => { navigate("/my-rentals"); setPanelOpen(false); }}
                                             style={{ padding: "10px 16px", borderTop: "1px solid #f1f5f9", textAlign: "center", cursor: "pointer", fontSize: "13px", color: "#2563eb", fontWeight: "500" }}>
                                            View all rentals →
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

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