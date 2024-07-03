from pydantic import BaseModel


class Todo(BaseModel):
    title: set
    description: str
