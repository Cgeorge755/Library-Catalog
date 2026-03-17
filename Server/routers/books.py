from fastapi import APIRouter, HTTPException, Query
from models.catalog.bookModel import Book
from database.database import get_books, save_books

router = APIRouter()


@router.get("/")
def get_all_books(
    search: str = Query(default=""),
    sort_by: str = Query(default="title"),
    order: str = Query(default="asc")
):
    books = get_books()

    if search:
        q = search.lower()
        books = [
            book for book in books
            if q in book["title"].lower()
            or q in book["author"].lower()
            or q in book["genre"].lower()
            or q in book["isbn"].lower()
            or q in book["publisher"].lower()
        ]

    reverse = order.lower() == "desc"

    if sort_by in ["title", "author", "genre", "publisher", "publication_year", "copies_available"]:
        books = sorted(books, key=lambda x: x.get(sort_by, ""), reverse=reverse)

    return books


@router.get("/{book_id}")
def get_book(book_id: int):
    books = get_books()
    for book in books:
        if book["id"] == book_id:
            return book
    raise HTTPException(status_code=404, detail="Book not found")


@router.post("/")
def create_book(book: Book):
    books = get_books()
    new_id = 1 if not books else max(item["id"] for item in books) + 1

    new_book = book.dict()
    new_book["id"] = new_id

    books.append(new_book)
    save_books(books)

    return {"message": "Book created successfully", "book": new_book}


@router.put("/{book_id}")
def update_book(book_id: int, updated_book: Book):
    books = get_books()

    for index, book in enumerate(books):
        if book["id"] == book_id:
            data = updated_book.dict()
            data["id"] = book_id
            books[index] = data
            save_books(books)
            return {"message": "Book updated successfully", "book": data}

    raise HTTPException(status_code=404, detail="Book not found")


@router.delete("/{book_id}")
def delete_book(book_id: int):
    books = get_books()
    filtered_books = [book for book in books if book["id"] != book_id]

    if len(filtered_books) == len(books):
        raise HTTPException(status_code=404, detail="Book not found")

    save_books(filtered_books)
    return {"message": "Book deleted successfully"}