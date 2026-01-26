from fastapi import APIRouter, HTTPException
from app.models.schemas import RiskAnalysisRequest, RiskAnalysisResponse
from app.core.risk import calculate_unified_risk
from app.core.registry import COUNTRY_REGISTRY

router = APIRouter()

@router.post("/analyze", response_model=RiskAnalysisResponse)
def analyze_risk(request: RiskAnalysisRequest):
    """
    Calculate unified displacement risk based on structural and weather factors.
    """
    
    try:
        result = calculate_unified_risk(
            country=request.country,
            rain_mm=request.rain_mm,
            wind_ms=request.wind_ms
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
