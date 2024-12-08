from fastapi import APIRouter, HTTPException
from app.services.weaviate_service import add_document, query_documents
from app.models.document_request import DocumentRequest

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/")
async def add_new_document(request: DocumentRequest):
    try:
        # Giải nén các trường từ request
        question = request.question
        answer = request.answer
        category = request.category

        # Gọi hàm add_document với tham số cụ thể
        add_document(question=question, answer=answer, category=category)

        return {"message": "Document added successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
async def search_documents(query: str, limit: int = 2):
    try:
        documents = query_documents(query=query, limit=limit)
        return {"documents": documents}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
