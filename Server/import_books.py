import csv
import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_FILE = os.path.join(BASE_DIR, "data", "books_catalogue.csv")
JSON_FILE = os.path.join(BASE_DIR, "database", "bookData.json")

books = []

with open(CSV_FILE, "r", encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)

    for index, row in enumerate(reader, start=1):
        book = {
            "id": index,
            "title": row.get("title", "").strip(),
            "author": row.get("authors", "").strip(),
            "isbn": row.get("isbn", "").strip(),
            "genre": row.get("language_code", "General").strip(),
            "publication_year": int(float(row.get("original_publication_year", 0) or 0)),
            "publisher": "Unknown",
            "copies_available": 5,
            "description": f"Average rating: {row.get('average_rating', 'N/A')}",
            "image_url": row.get("image_url", "").strip()
        }

        if book["title"]:
            books.append(book)

with open(JSON_FILE, "w", encoding="utf-8") as jsonfile:
    json.dump(books, jsonfile, indent=2, ensure_ascii=False)

print(f"Imported {len(books)} books into bookData.json")