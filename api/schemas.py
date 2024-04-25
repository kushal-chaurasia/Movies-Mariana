from pydantic import BaseModel, Field
from typing import List, Optional

class MovieSchema(BaseModel):
    genre: Optional[List[str]] = Field(None, description="Genre of the movie")
    query: Optional[str] = Field(None, description="Search query")