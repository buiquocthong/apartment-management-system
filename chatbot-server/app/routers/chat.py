from fastapi import APIRouter, HTTPException
from app.services.weaviate_service import generate_response, print_all_documents
from app.models.chat_request import ChatRequest

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/")
async def ask_chatbot(request: ChatRequest):
    try:
        result = generate_response(
            query=request.query,
            limit=request.limit
        )
        print_all_documents()
        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
