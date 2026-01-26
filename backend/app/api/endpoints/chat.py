from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq import Groq
import os

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    persona: str
    system_prompt: str
    context: str = ""
    data_sources: list = []

class ChatResponse(BaseModel):
    answer: str
    persona_used: str

@router.post("/analyze", response_model=ChatResponse)
async def analyze_with_context(request: ChatRequest):
    """
    Analyze a query with real-time data context using Groq LLM.
    """
    try:
        client = Groq(api_key=os.getenv("GROQ_API"))
        
        # Build the full prompt with context
        user_prompt = f"""Based on the following real-time data, please analyze the user's query.

## User Query:
{request.query}

## Available Real-Time Data:
{request.context if request.context else "No specific data available for this query."}

## Data Sources Used:
{', '.join(request.data_sources) if request.data_sources else "None"}

Please provide a comprehensive analysis addressing the user's query. Include:
1. Key findings from the data
2. Risk assessment if applicable
3. Recommendations based on your expertise
4. Any caveats or limitations of the analysis
"""
        
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": request.system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=2048
        )
        
        return ChatResponse(
            answer=response.choices[0].message.content,
            persona_used=request.persona
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
