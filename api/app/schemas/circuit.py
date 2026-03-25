from pydantic import BaseModel, Field
from typing import Dict, Optional

class CircuitRequest(BaseModel):
    qasm_string: str = Field(..., description="Quantum circuit in OpenQASM format")
    error_rate: float = Field(0.01, description="Depolarizing error rate (0.0 to 1.0)")
    shots: int = Field(1024, description="Number of measurement shots")

class ShieldResponse(BaseModel):
    original_depth: int
    shielded_depth: int
    shielded_qasm: str
    message: str

class RunResponse(BaseModel):
    raw_counts: Dict[str, int]
    corrected_counts: Dict[str, int]
    improvement_factor: float
    message: str