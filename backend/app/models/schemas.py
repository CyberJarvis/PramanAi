from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class SimulationRequest(BaseModel):
    country: str = Field(..., description="Target country for simulation")
    intervention_strength: float = Field(0.0, ge=0.0, le=1.0, description="Strength of policy intervention (0.0 - 1.0)")
    current_rain: float = Field(0.0, ge=0.0, description="Current rainfall in mm")

class SimulationResponse(BaseModel):
    baseline: List[int]
    mitigated: List[int]
    weeks: List[int]
    total_displacement_baseline: int
    total_displacement_mitigated: int
    prevented_displacement: int
    reduction_percentage: float

class RiskAnalysisRequest(BaseModel):
    country: str
    rain_mm: float
    wind_ms: float

class RiskAnalysisResponse(BaseModel):
    pred: int
    risk_index: int
    driver: str
    explanation: str
    proof: str
    status: str
    drivers_breakdown: Dict[str, float]
