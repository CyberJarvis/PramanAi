from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI(
    title="PRAMAN-AI Backend API",
    description="AI Service layer for Causal Inference, RAG, and Simulation",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
# In production, allow specific origins. For now, allow all for dev.
origins = [
    "http://localhost:3000", # Next.js frontend
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update this for stricter security in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "PRAMAN-AI Backend",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

from app.api.endpoints import simulation, risk, council, documents, chat

app.include_router(simulation.router, prefix="/api/simulation", tags=["Simulation"])
app.include_router(risk.router, prefix="/api/risk", tags=["Risk Analysis"])
app.include_router(council.router, prefix="/api/council", tags=["Situation Room"])
app.include_router(documents.router, prefix="/api/documents", tags=["RAG Documents"])
app.include_router(chat.router, prefix="/api/chat", tags=["Live Data Chat"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
