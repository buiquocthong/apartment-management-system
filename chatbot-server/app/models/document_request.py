from pydantic import BaseModel

class DocumentRequest(BaseModel):
    question: str
    answer: str
    category: str
