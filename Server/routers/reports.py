from fastapi import APIRouter
from database.database import get_books, get_users, get_rentals
from datetime import datetime
from collections import Counter

router = APIRouter()


@router.get("/")
def get_reports():
    books = get_books()
    users = get_users()
    rentals = get_rentals()

    today = datetime.now().date()

    # ── Rental stats ──────────────────────────────────────────────────────────
    total_rentals = len(rentals)
    active_rentals = [r for r in rentals if not r["returned"]]
    returned_rentals = [r for r in rentals if r["returned"]]

    overdue_rentals = [
        r for r in active_rentals
        if datetime.strptime(r["due_date"], "%Y-%m-%d").date() < today
    ]

    # ── Revenue ───────────────────────────────────────────────────────────────
    total_revenue = sum(r["total_cost"] for r in rentals)
    active_revenue = sum(r["total_cost"] for r in active_rentals)

    # ── Most rented books ─────────────────────────────────────────────────────
    book_rental_counts = Counter(r["book_title"] for r in rentals)
    top_books = [
        {"title": title, "rentals": count}
        for title, count in book_rental_counts.most_common(5)
    ]

    # ── Most active users ─────────────────────────────────────────────────────
    user_rental_counts = Counter(r["user_name"] for r in rentals)
    top_users = [
        {"name": name, "rentals": count}
        for name, count in user_rental_counts.most_common(5)
    ]

    # ── Rentals per day (last 7 days) ─────────────────────────────────────────
    from datetime import timedelta
    rentals_by_day = {}
    for i in range(6, -1, -1):
        day = (today - timedelta(days=i)).strftime("%Y-%m-%d")
        rentals_by_day[day] = 0

    for r in rentals:
        day = r["rented_on"]
        if day in rentals_by_day:
            rentals_by_day[day] += 1

    daily_rentals = [
        {"date": day, "count": count}
        for day, count in rentals_by_day.items()
    ]

    # ── Book availability ─────────────────────────────────────────────────────
    available_books = len([b for b in books if b["copies_available"] > 0])
    unavailable_books = len(books) - available_books

    return {
        "summary": {
            "total_books": len(books),
            "total_users": len([u for u in users if u["role"] == "user"]),
            "total_rentals": total_rentals,
            "active_rentals": len(active_rentals),
            "returned_rentals": len(returned_rentals),
            "overdue_rentals": len(overdue_rentals),
            "total_revenue": round(total_revenue, 2),
            "active_revenue": round(active_revenue, 2),
            "available_books": available_books,
            "unavailable_books": unavailable_books,
        },
        "top_books": top_books,
        "top_users": top_users,
        "daily_rentals": daily_rentals,
        "overdue_list": [
            {
                "user": r["user_name"],
                "book": r["book_title"],
                "due_date": r["due_date"],
                "days_overdue": (today - datetime.strptime(r["due_date"], "%Y-%m-%d").date()).days
            }
            for r in overdue_rentals
        ]
    }