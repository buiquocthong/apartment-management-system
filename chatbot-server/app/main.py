from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # Import CORS Middleware
from app.routers import chat, documents

app = FastAPI(
    title="RAG Chatbot API",
    version="1.0.0",
    description="RESTful API for RAG Chatbot with Weaviate."
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Nguồn cho phép (React app)
    allow_credentials=True,  # Cho phép gửi cookie hoặc thông tin xác thực
    allow_methods=["*"],  # Cho phép tất cả các phương thức HTTP
    allow_headers=["*"],  # Cho phép tất cả các tiêu đề
)

# Include routers
app.include_router(chat.router)
app.include_router(documents.router)
