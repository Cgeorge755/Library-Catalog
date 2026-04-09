# Libratech — Library Catalogue System

## Overview

Libratech is a web-based library catalogue system that allows users to browse, rent, and manage books. It uses a React frontend and a FastAPI backend with JSON file storage.

---

## Features

- Browse and search the full book catalogue
- Search by title, author, genre, ISBN, or publisher
- Sort by any field (title, author, year, copies)
- Rent books with a configurable number of days
- Renew rentals (up to 2 times)
- Return books
- View rental history with due date status (Active / Due Soon / Overdue / Returned)
- Notification bell for upcoming due dates
- Admin dashboard — manage books, users, and rentals
- Usage reports — rental stats, revenue, top books, top users
- Role-based access — admin vs user vs guest

---

## Prerequisites

Install the following before running the project:

### Python 3.11
Download: https://www.python.org/downloads/
> ✅ Check **"Add Python to PATH"** during install

### Node.js (LTS)
Download: https://nodejs.org/
> npm is installed automatically with Node.js

---

## One-Time Setup

### Backend
Open a terminal and navigate to the **Server** folder:
```
cd Server
pip install fastapi uvicorn
```

### Frontend
Open a second terminal and navigate to the **client** folder:
```
cd client
npm install
```

### Import Books (run once to load the catalogue)
```
cd Server
python import_books.py
```
This loads all books from `data/books_catalogue.csv` into `database/bookData.json`.

---

## Running the App

You need **two terminals open at the same time**.

### Terminal 1 — Backend
```
cd Server
python -m uvicorn main:app --reload
```
The API will be available at: `http://127.0.0.1:8000`

### Terminal 2 — Frontend
```
cd client
npm start
```
The app will open automatically at: `http://localhost:3000`

---

## Test Accounts

| Role  | Email                  | Password |
|-------|------------------------|----------|
| Admin | admin@libratech.com    | admin123 |
| User  | user@libratech.com     | user123  |

---

## Project Structure

```
Library-Catalog/
├── client/                         React frontend
│   ├── public/index.html
│   └── src/
│       ├── App.js                  Routes
│       ├── index.css               Styles
│       ├── components/
│       │   └── Navbar.js           Navigation + notification bell
│       ├── pages/
│       │   ├── Home.js             Book catalogue
│       │   ├── Create.js           Add book (admin)
│       │   ├── Modify.js           Edit book (admin)
│       │   ├── Login.js            Login page
│       │   ├── Register.js         Register page
│       │   ├── RentBook.js         Rent a book (user)
│       │   ├── MyRentals.js        Rental history (user)
│       │   ├── AdminDashboard.js   Admin management panel
│       │   └── Reports.js          Usage reports (admin)
│       └── utils/
│           └── Axios.js            API base config
│
└── Server/                         FastAPI backend
    ├── main.py                     Entry point + CORS
    ├── import_books.py             CSV → JSON importer
    ├── data/
    │   └── books_catalogue.csv     Source book data
    ├── database/
    │   ├── database.py             JSON read/write helpers
    │   ├── bookData.json           Book records
    │   ├── userData.json           User accounts
    │   └── rentalsData.json        Rental records
    ├── models/
    │   ├── catalog/bookModel.py    Book schema
    │   ├── rental/rentalModel.py   Rental schema
    │   └── user/userModel.py       User schema
    └── routers/
        ├── books.py                Book CRUD + rent/return
        ├── users.py                Register, login, delete
        ├── rentals.py              Rental create/renew/return
        └── reports.py              Usage report endpoint
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /books/ | Get all books (search + sort) |
| GET | /books/{id} | Get single book |
| POST | /books/ | Add book |
| PUT | /books/{id} | Update book |
| DELETE | /books/{id} | Delete book |
| POST | /users/register | Register user |
| POST | /users/login | Login |
| GET | /users/ | Get all users (admin) |
| DELETE | /users/{id} | Delete user (admin) |
| POST | /rentals/ | Create rental |
| GET | /rentals/ | Get all rentals |
| GET | /rentals/user/{id} | Get user's rentals |
| PUT | /rentals/{id}/renew | Renew rental |
| PUT | /rentals/{id}/return | Return rental |
| GET | /reports/ | Get usage report |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `pip not found` | Reinstall Python and check "Add to PATH" |
| `uvicorn not found` | Run `pip install fastapi uvicorn` |
| `npm not found` | Reinstall Node.js |
| `npm install` fails | Delete `node_modules` folder and run `npm install` again |
| Books page is empty | Run `python import_books.py` from the Server folder |
| Register/Login fails | Make sure the backend is running in Terminal 1 |
| WebStorm import errors | Right-click `Server` folder → Mark Directory as → Sources Root |
