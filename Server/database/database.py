import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BOOKS_FILE = os.path.join(BASE_DIR, "bookData.json")
USERS_FILE = os.path.join(BASE_DIR, "userData.json")
RENTALS_FILE = os.path.join(BASE_DIR, "rentalsData.json")


def read_json(path):
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as file:
        try:
            return json.load(file)
        except json.JSONDecodeError:
            return []


def write_json(path, data):
    with open(path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=2, ensure_ascii=False)


def get_books():
    return read_json(BOOKS_FILE)


def save_books(data):
    write_json(BOOKS_FILE, data)


def get_users():
    return read_json(USERS_FILE)


def save_users(data):
    write_json(USERS_FILE, data)


def get_rentals():
    return read_json(RENTALS_FILE)


def save_rentals(data):
    write_json(RENTALS_FILE, data)