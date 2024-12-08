from pydantic import BaseModel

class ChatRequest(BaseModel):
    query: str
    limit: int = 2
    grouped_task: str = None
