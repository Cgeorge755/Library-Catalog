from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from database.database import get_books, save_books, get_rentals, save_rentals

router = APIRouter()

COST_PER_DAY = 2.5


@router.post("/")
def create_rental(data: dict):
    user_id = data.get("user_id")
    user_name = data.get("user_name")
    book_id = data.get("book_id")
    rental_days = int(data.get("rental_days", 0))

    if rental_days <= 0:
        raise HTTPException(status_code=400, detail="Rental days must be greater than 0")

    books = get_books()
    rentals = get_rentals()

    selected_book = None
    for book in books:
        if book["id"] == book_id:
            selected_book = book
            break

    if not selected_book:
        raise HTTPException(status_code=404, detail="Book not found")

    if selected_book.get("copies_available", 0) <= 0:
        raise HTTPException(status_code=400, detail="Book is not available")

    selected_book["copies_available"] -= 1
    save_books(books)

    rented_on = datetime.now()
    due_date = rented_on + timedelta(days=rental_days)
    total_cost = rental_days * COST_PER_DAY

    new_id = 1 if not rentals else max(r["id"] for r in rentals) + 1

    rental = {
        "id": new_id,
        "user_id": user_id,
        "user_name": user_name,
        "book_id": book_id,
        "book_title": selected_book["title"],
        "book_image_url": selected_book.get("image_url", ""),
        "rental_days": rental_days,
        "cost_per_day": COST_PER_DAY,
        "total_cost": total_cost,
        "rented_on": rented_on.strftime("%Y-%m-%d"),
        "due_date": due_date.strftime("%Y-%m-%d"),
        "returned": False
    }

    rentals.append(rental)
    save_rentals(rentals)

    return {"message": "Book rented successfully", "rental": rental}


@router.get("/user/{user_id}")
def get_user_rentals(user_id: int):
    rentals = get_rentals()
    return [r for r in rentals if r["user_id"] == user_id]


@router.get("/")
def get_all_rentals():
    return get_rentals()


@router.put("/{rental_id}/return")
def return_rental(rental_id: int):
    rentals = get_rentals()
    books = get_books()

    target_rental = None
    for rental in rentals:
        if rental["id"] == rental_id:
            target_rental = rental
            break

    if not target_rental:
        raise HTTPException(status_code=404, detail="Rental not found")

    if target_rental["returned"]:
        raise HTTPException(status_code=400, detail="Book already returned")

    target_rental["returned"] = True

    for book in books:
        if book["id"] == target_rental["book_id"]:
            book["copies_available"] += 1
            break

    save_rentals(rentals)
    save_books(books)

    return {"message": "Book returned successfully"}