from pydantic import BaseModel
from typing import Optional


class Rental(BaseModel):
    id: Optional[int] = None
    user_id: int
    user_name: str
    book_id: int
    book_title: str
    book_image_url: str = ""
    rental_days: int
    cost_per_day: float
    total_cost: float
    rented_on: str
    due_date: str
    returned: bool = False