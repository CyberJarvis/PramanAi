from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq import Groq
import os
import asyncio
from concurrent.futures import ThreadPoolExecutor

from app.core.personas import ANALYST_PERSONAS

router = APIRouter()

class CouncilRequest(BaseModel):
    scenario_a_name: str
    scenario_a_desc: str
    scenario_b_name: str
    scenario_b_desc: str

class CouncilResponse(BaseModel):
    economist: str
    humanist: str
    security: str
    verdict: str
    winner: str
    scores: dict

def call_llm(system_prompt: str, user_prompt: str) -> str:
    """Call Groq LLM with given prompts."""
    client = Groq(api_key=os.getenv("GROQ_API"))
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.7,
        max_tokens=1024
    )
    
    return response.choices[0].message.content

@router.post("/debate", response_model=CouncilResponse)
async def run_council_debate(request: CouncilRequest):
    """
    Run a multi-stakeholder council debate on two policy scenarios.
    Orchestrates 3 parallel LLM calls + 1 synthesis call.
    """
    
    comparison_prompt = f"""
Compare these two migration policy scenarios:

**Scenario A ({request.scenario_a_name}):** {request.scenario_a_desc}

**Scenario B ({request.scenario_b_name}):** {request.scenario_b_desc}

Provide your analysis and a clear verdict on which approach is better from your perspective.
"""
    
    try:
        # Run 3 expert analyses in parallel
        loop = asyncio.get_event_loop()
        with ThreadPoolExecutor(max_workers=3) as executor:
            economist_task = loop.run_in_executor(
                executor,
                call_llm,
                ANALYST_PERSONAS["Economist"]["system_prompt"],
                comparison_prompt
            )
            humanist_task = loop.run_in_executor(
                executor,
                call_llm,
                ANALYST_PERSONAS["HumanRights"]["system_prompt"],
                comparison_prompt
            )
            security_task = loop.run_in_executor(
                executor,
                call_llm,
                ANALYST_PERSONAS["Security"]["system_prompt"],
                comparison_prompt
            )
            
            economist_result, humanist_result, security_result = await asyncio.gather(
                economist_task, humanist_task, security_task
            )
        
        # Synthesis call
        synthesis_prompt = f"""
You are synthesizing expert opinions on two scenarios:

**ECONOMIST:** {economist_result}

**HUMAN RIGHTS EXPERT:** {humanist_result}

**SECURITY ANALYST:** {security_result}

Provide:
1. A clear winner between "{request.scenario_a_name}" and "{request.scenario_b_name}"
2. Key trade-offs
3. Implementation recommendations
"""
        
        verdict = call_llm(
            ANALYST_PERSONAS["Synthesizer"]["system_prompt"],
            synthesis_prompt
        )
        
        # Determine winner from verdict
        winner = request.scenario_b_name if request.scenario_b_name.lower() in verdict.lower() else request.scenario_a_name
        
        # Generate comparison scores (simplified heuristic)
        scores = {
            request.scenario_a_name: {
                "ROI": 3, "Ethics": 4, "Stability": 2, "Speed": 5, "Feasibility": 8
            },
            request.scenario_b_name: {
                "ROI": 8, "Ethics": 9, "Stability": 8, "Speed": 4, "Feasibility": 5
            }
        }
        
        return CouncilResponse(
            economist=economist_result,
            humanist=humanist_result,
            security=security_result,
            verdict=verdict,
            winner=winner,
            scores=scores
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
