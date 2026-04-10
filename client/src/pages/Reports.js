import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/Axios";

function Reports() {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!currentUser || currentUser.role !== "admin") {
            navigate("/");
            return;
        }
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const response = await API.get("/reports/");
            setReport(response.data);
        } catch (err) {
            setError("Failed to load report data.");
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser || currentUser.role !== "admin") {
        return <div className="form-page"><h2>Access denied. Admin only.</h2></div>;
    }

    if (loading) return <div className="container"><p>Loading report...</p></div>;
    if (error) return <div className="container"><p style={{ color: "red" }}>{error}</p></div>;

    const { summary, top_books, top_users, daily_rentals, overdue_list } = report;

    const maxDaily = Math.max(...daily_rentals.map(d => d.count), 1);

    return (
        <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 className="page-title" style={{ margin: 0 }}>Library Usage Report</h1>
                <button className="btn secondary" onClick={fetchReport}>↻ Refresh</button>
            </div>

            {/* ── Summary Cards ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "32px" }}>
                {[
                    { label: "Total Books", value: summary.total_books, color: "#2563eb" },
                    { label: "Total Users", value: summary.total_users, color: "#0f766e" },
                    { label: "Total Rentals", value: summary.total_rentals, color: "#7c3aed" },
                    { label: "Active Rentals", value: summary.active_rentals, color: "#d97706" },
                    { label: "Returned", value: summary.returned_rentals, color: "#16a34a" },
                    { label: "Overdue", value: summary.overdue_rentals, color: "#dc2626" },
                    { label: "Total Revenue", value: `$${summary.total_revenue.toFixed(2)}`, color: "#0f766e" },
                    { label: "Available Books", value: summary.available_books, color: "#2563eb" },
                ].map((card, i) => (
                    <div key={i} style={{
                        background: "white",
                        borderRadius: "12px",
                        padding: "20px 16px",
                        boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
                        borderTop: `4px solid ${card.color}`,
                        textAlign: "center"
                    }}>
                        <div style={{ fontSize: "28px", fontWeight: "bold", color: card.color }}>{card.value}</div>
                        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "6px" }}>{card.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Two column layout ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>

                {/* Top Books */}
                <div style={{ background: "white", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 18px rgba(0,0,0,0.08)" }}>
                    <h2 style={{ fontSize: "16px", marginBottom: "16px", color: "#0f172a" }}>Top 5 Most Rented Books</h2>
                    {top_books.length === 0 ? <p style={{ color: "#64748b" }}>No rental data yet.</p> : (
                        top_books.map((book, i) => (
                            <div key={i} style={{ marginBottom: "12px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                                    <span style={{ color: "#1f2937", fontWeight: "500", maxWidth: "75%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.title}</span>
                                    <span style={{ color: "#2563eb", fontWeight: "bold" }}>{book.rentals} rental{book.rentals !== 1 ? "s" : ""}</span>
                                </div>
                                <div style={{ background: "#e2e8f0", borderRadius: "4px", height: "6px" }}>
                                    <div style={{ background: "#2563eb", borderRadius: "4px", height: "6px", width: `${(book.rentals / top_books[0].rentals) * 100}%` }} />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Top Users */}
                <div style={{ background: "white", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 18px rgba(0,0,0,0.08)" }}>
                    <h2 style={{ fontSize: "16px", marginBottom: "16px", color: "#0f172a" }}>Top 5 Most Active Users</h2>
                    {top_users.length === 0 ? <p style={{ color: "#64748b" }}>No user data yet.</p> : (
                        top_users.map((user, i) => (
                            <div key={i} style={{ marginBottom: "12px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                                    <span style={{ color: "#1f2937", fontWeight: "500" }}>{user.name}</span>
                                    <span style={{ color: "#0f766e", fontWeight: "bold" }}>{user.rentals} rental{user.rentals !== 1 ? "s" : ""}</span>
                                </div>
                                <div style={{ background: "#e2e8f0", borderRadius: "4px", height: "6px" }}>
                                    <div style={{ background: "#0f766e", borderRadius: "4px", height: "6px", width: `${(user.rentals / top_users[0].rentals) * 100}%` }} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ── Daily Rentals Bar Chart ── */}
            <div style={{ background: "white", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 18px rgba(0,0,0,0.08)", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "16px", marginBottom: "20px", color: "#0f172a" }}>Rentals — Last 7 Days</h2>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "120px" }}>
                    {daily_rentals.map((day, i) => (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%" }}>
                            <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "bold" }}>{day.count > 0 ? day.count : ""}</div>
                            <div style={{ width: "100%", display: "flex", alignItems: "flex-end", flex: 1 }}>
                                <div style={{
                                    width: "100%",
                                    background: day.count > 0 ? "#2563eb" : "#e2e8f0",
                                    borderRadius: "4px 4px 0 0",
                                    height: `${Math.max((day.count / maxDaily) * 100, 4)}%`,
                                    transition: "height 0.3s ease"
                                }} />
                            </div>
                            <div style={{ fontSize: "10px", color: "#94a3b8", textAlign: "center" }}>
                                {day.date.slice(5)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Availability Split ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                <div style={{ background: "white", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 18px rgba(0,0,0,0.08)" }}>
                    <h2 style={{ fontSize: "16px", marginBottom: "16px", color: "#0f172a" }}>Book Availability</h2>
                    <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#16a34a" }}>{summary.available_books}</div>
                            <div style={{ fontSize: "12px", color: "#64748b" }}>Available</div>
                        </div>
                        <div style={{ flex: 1, background: "#e2e8f0", borderRadius: "8px", height: "12px", overflow: "hidden" }}>
                            <div style={{
                                background: "#16a34a",
                                height: "100%",
                                width: `${(summary.available_books / (summary.available_books + summary.unavailable_books || 1)) * 100}%`,
                                borderRadius: "8px"
                            }} />
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#dc2626" }}>{summary.unavailable_books}</div>
                            <div style={{ fontSize: "12px", color: "#64748b" }}>Unavailable</div>
                        </div>
                    </div>
                </div>

                {/* Rental status split */}
                <div style={{ background: "white", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 18px rgba(0,0,0,0.08)" }}>
                    <h2 style={{ fontSize: "16px", marginBottom: "16px", color: "#0f172a" }}>Rental Status</h2>
                    <div style={{ display: "flex", gap: "16px" }}>
                        {[
                            { label: "Active", value: summary.active_rentals, color: "#d97706" },
                            { label: "Returned", value: summary.returned_rentals, color: "#16a34a" },
                            { label: "Overdue", value: summary.overdue_rentals, color: "#dc2626" },
                        ].map((item, i) => (
                            <div key={i} style={{ flex: 1, textAlign: "center", padding: "12px", background: "#f8fafc", borderRadius: "8px", borderTop: `3px solid ${item.color}` }}>
                                <div style={{ fontSize: "24px", fontWeight: "bold", color: item.color }}>{item.value}</div>
                                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Overdue List ── */}
            {overdue_list.length > 0 && (
                <div style={{ background: "white", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 18px rgba(0,0,0,0.08)" }}>
                    <h2 style={{ fontSize: "16px", marginBottom: "16px", color: "#dc2626" }}>⚠ Overdue Rentals</h2>
                    <div style={{ overflowX: "auto" }}>
                        <table className="admin-table">
                            <thead>
                            <tr>
                                <th>User</th>
                                <th>Book</th>
                                <th>Due Date</th>
                                <th>Days Overdue</th>
                            </tr>
                            </thead>
                            <tbody>
                            {overdue_list.map((item, i) => (
                                <tr key={i}>
                                    <td>{item.user}</td>
                                    <td>{item.book}</td>
                                    <td>{item.due_date}</td>
                                    <td style={{ color: "#dc2626", fontWeight: "bold" }}>{item.days_overdue} day{item.days_overdue !== 1 ? "s" : ""}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Reports;