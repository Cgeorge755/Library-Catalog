from pydantic import BaseModel
from typing import Optional


class Book(BaseModel):
    id: Optional[int] = None
    title: str
    author: str
    isbn: str
    genre: str
    publication_year: int
    publisher: str
    copies_available: int
    description: str