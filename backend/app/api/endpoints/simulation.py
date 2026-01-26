from fastapi import APIRouter, HTTPException
from app.models.schemas import SimulationRequest, SimulationResponse
from app.core.engine import CausalDeepLearningEngine
from app.core.registry import COUNTRY_REGISTRY

router = APIRouter()
engine = CausalDeepLearningEngine()

@router.post("/run", response_model=SimulationResponse)
def run_simulation(request: SimulationRequest):
    """
    Run a counterfactual causal simulation for displacement trajectories.
    """
    # Validate country
    if request.country not in COUNTRY_REGISTRY:
        # Fallback/Log or Error? For now, allow it but maybe warn
        # Actually, let's allow any country for simulation, but registry data is preferred
        pass

    try:
        # Run simulation logic
        result = engine.run_simulation(
            current_rain=request.current_rain,
            intervention_strength=request.intervention_strength
        )
        
        baseline = result["baseline"]
        mitigated = result["mitigated"]
        
        # Calculate impacts
        total_baseline = sum(baseline)
        total_mitigated = sum(mitigated)
        prevented = max(0, total_baseline - total_mitigated)
        reduction = (prevented / total_baseline * 100) if total_baseline > 0 else 0.0
        
        return {
            "baseline": baseline,
            "mitigated": mitigated,
            "weeks": list(range(1, 13)), # 12 weeks
            "total_displacement_baseline": total_baseline,
            "total_displacement_mitigated": total_mitigated,
            "prevented_displacement": prevented,
            "reduction_percentage": round(reduction, 1)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
