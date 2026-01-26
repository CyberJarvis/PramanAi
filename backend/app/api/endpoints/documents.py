from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from groq import Groq
import os
import tempfile
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

from app.core.personas import ANALYST_PERSONAS

router = APIRouter()

# In-memory vector store (resets on server restart)
vector_store = None
documents_ingested = []

class QueryRequest(BaseModel):
    query: str
    persona: str = "General"

class QueryResponse(BaseModel):
    answer: str
    sources: list
    persona_used: str

# Persona system prompts
CHAT_PERSONAS = {
    "General": {
        "name": "General Analyst",
        "system_prompt": "You are a helpful AI assistant analyzing humanitarian documents. Provide clear, factual answers based on the context provided."
    },
    "UN Crisis Coordinator": {
        "name": "UN Crisis Coordinator",
        "system_prompt": """You are a senior UN OCHA Crisis Coordinator with 20 years of field experience.
Analyze documents through the lens of humanitarian response coordination.
Focus on: inter-agency coordination, resource mobilization, affected population needs, protection concerns.
Speak with authority and cite specific humanitarian principles when relevant."""
    },
    "Climate Data Scientist": {
        "name": "Climate Data Scientist",
        "system_prompt": """You are a climate scientist specializing in displacement analytics.
Analyze documents through the lens of climate-migration nexus.
Focus on: climate attribution, projection models, vulnerability indices, adaptation strategies.
Use data-driven language and reference scientific frameworks."""
    },
    "Policy Strategist": {
        "name": "Policy Strategist",
        "system_prompt": """You are a policy strategist advising governments on migration policy.
Analyze documents through the lens of policy implementation and political feasibility.
Focus on: legal frameworks, bilateral agreements, funding mechanisms, stakeholder mapping.
Be pragmatic and solution-oriented."""
    },
    "Humanitarian Economist": {
        "name": "Humanitarian Economist",
        "system_prompt": """You are an economist specializing in disaster economics and forced displacement.
Analyze documents through the lens of cost-benefit analysis and resource efficiency.
Focus on: ROI of interventions, cost per beneficiary, economic multipliers, fiscal sustainability.
Use economic terminology and reference development frameworks."""
    },
    "Human Rights Investigator": {
        "name": "Human Rights Investigator",
        "system_prompt": """You are a human rights investigator from Amnesty International.
Analyze documents through the lens of international humanitarian law and human dignity.
Focus on: rights violations, vulnerable populations, accountability mechanisms, protection gaps.
Be principled and cite relevant conventions."""
    }
}

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Upload a PDF document and ingest it into the vector store.
    """
    global vector_store, documents_ingested
    
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        # Load and split document
        loader = PyPDFLoader(tmp_path)
        pages = loader.load()
        
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        chunks = text_splitter.split_documents(pages)
        
        # Create embeddings
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        
        # Add to vector store
        if vector_store is None:
            vector_store = FAISS.from_documents(chunks, embeddings)
        else:
            vector_store.add_documents(chunks)
        
        documents_ingested.append({
            "filename": file.filename,
            "pages": len(pages),
            "chunks": len(chunks)
        })
        
        # Cleanup
        os.unlink(tmp_path)
        
        return {
            "success": True,
            "message": f"Ingested {file.filename}",
            "pages": len(pages),
            "chunks": len(chunks),
            "total_documents": len(documents_ingested)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    """
    Query the ingested documents using RAG with optional persona.
    """
    global vector_store
    
    if vector_store is None:
        raise HTTPException(
            status_code=400, 
            detail="No documents ingested. Please upload a PDF first."
        )
    
    try:
        # Retrieve relevant chunks
        docs = vector_store.similarity_search(request.query, k=4)
        context = "\n\n".join([doc.page_content for doc in docs])
        
        # Get persona
        persona = CHAT_PERSONAS.get(request.persona, CHAT_PERSONAS["General"])
        
        # Call Groq LLM
        client = Groq(api_key=os.getenv("GROQ_API"))
        
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": persona["system_prompt"]},
                {"role": "user", "content": f"""Based on the following document context, answer the user's question.

CONTEXT:
{context}

QUESTION: {request.query}

Provide a comprehensive answer based on the context. If the context doesn't contain enough information, say so clearly."""}
            ],
            temperature=0.7,
            max_tokens=1024
        )
        
        answer = response.choices[0].message.content
        
        # Extract source info
        sources = []
        for i, doc in enumerate(docs):
            sources.append({
                "chunk": i + 1,
                "preview": doc.page_content[:200] + "..."
            })
        
        return QueryResponse(
            answer=answer,
            sources=sources,
            persona_used=persona["name"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def get_rag_status():
    """Get current RAG system status."""
    return {
        "documents_ingested": len(documents_ingested),
        "documents": documents_ingested,
        "personas_available": list(CHAT_PERSONAS.keys())
    }
