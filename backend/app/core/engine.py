import numpy as np
from sklearn.preprocessing import MinMaxScaler

class CausalDeepLearningEngine:
    """
    Simulates counterfactual displacement scenarios under different policy interventions.
    
    Methodology:
    - Baseline: No intervention (natural disaster progression)
    - Intervention: Policy reduces displacement through early warning, aid, shelter
    
    Model: Logistic growth with intervention decay factor
    """
    def __init__(self):
        self.scaler = MinMaxScaler(feature_range=(0, 1))

    def run_simulation(self, current_rain: float = 0.0, intervention_strength: float = 0.0):
        """
        Run a 12-week displacement simulation.
        
        Args:
            current_rain (float): Current rainfall in mm.
            intervention_strength (float): 0.0 (none) to 1.0 (maximum)
            
        Returns:
            dict: { "baseline": [int], "mitigated": [int] }
        """
        weeks = 12
        baseline = []
        mitigated = []
        
        rain = max(0, current_rain)
        risk_multiplier = 1.0 + (rain / 15.0)  # More rain = faster growth
        base_val = 400 * risk_multiplier
        
        # We start simulation from week 0
        for w in range(weeks):
            # Logistic growth model (realistic crisis escalation)
            # Center growth spurt around week 3
            growth = base_val / (1 + np.exp(-0.5 * (w - 3)))
            
            # Add some variability (noise) for realism
            noise = np.random.uniform(0, 20)
            val = int(growth + base_val + noise)
            baseline.append(val)
            
            # Intervention strategy: exponential decay effect
            # Intervention effectiveness increases over time
            decay = 0.1 + (intervention_strength * 0.4)
            mit_factor = (1 - decay) ** (w * 0.5)
            mit_val = val * mit_factor
            mitigated.append(int(max(0, mit_val)))
        
        return {
            "baseline": baseline,
            "mitigated": mitigated
        }
