from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.books import router as books_router
from routers.users import router as users_router
from routers.rentals import router as rentals_router
from routers.reports import router as reports_router

app = FastAPI(title="Libratech API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(books_router, prefix="/books", tags=["Books"])
app.include_router(rentals_router, prefix="/rentals", tags=["Rentals"])
app.include_router(reports_router, prefix="/reports", tags=["Reports"])


@app.get("/")
def root():
    return {"message": "Welcome to Libratech API"}