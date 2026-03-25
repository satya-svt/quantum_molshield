from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Import schemas and helpers
from app.schemas.circuit import CircuitRequest, ShieldResponse, RunResponse
from app.utils.qiskit_helper import qasm_to_circuit, circuit_to_qasm
from app.shield.core import shield_circuit, run_shielded

load_dotenv()

app = FastAPI(
    title="MolShield QEC API",
    description="General-purpose quantum error correction shield API",
    version="1.0.0"
)

# CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def verify_api_key(x_api_key: str = Header(None)):
    """Simple API key check (open mode for hackathon)"""
    open_access = os.getenv("OPEN_ACCESS_MODE", "True").lower() == "true"
    if open_access:
        return
    expected_key = os.getenv("API_KEY")
    if expected_key and x_api_key != expected_key:
        raise HTTPException(status_code=401, detail="Invalid API Key")

@app.get("/", tags=["Health"])
def read_root():
    return {"message": "MolShield QEC API is running!", "status": "online"}

# ==================== SHIELD ENDPOINT ====================
@app.post("/shield", tags=["Quantum Shield"], response_model=ShieldResponse, dependencies=[Depends(verify_api_key)])
def shield_endpoint(req: CircuitRequest):
    """
    Main endpoint: Takes QASM and returns shielded circuit.
    """
    try:
        original_qc = qasm_to_circuit(req.qasm_string)
        
        shielded_qc = shield_circuit(original_qc)
        
        return ShieldResponse(
            original_depth=original_qc.depth(),
            shielded_depth=shielded_qc.depth(),
            shielded_qasm=circuit_to_qasm(shielded_qc),
            message="Circuit successfully shielded against decoherence."
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to shield circuit: {str(e)}")


# ==================== RUN SHIELDED ENDPOINT ====================
@app.post("/run_shielded", tags=["Quantum Shield Simulator"], response_model=RunResponse, dependencies=[Depends(verify_api_key)])
def run_shielded_endpoint(req: CircuitRequest):
    """
    Runs the shielded circuit with noise and returns results.
    """
    try:
        original_qc = qasm_to_circuit(req.qasm_string)
        
        raw_counts, corrected_counts, improvement = run_shielded(
            original_qc, req.error_rate, req.shots
        )
        
        return RunResponse(
            raw_counts=raw_counts,
            corrected_counts=corrected_counts,
            improvement_factor=improvement,
            message="Shielded execution completed successfully."
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to execute shielded run: {str(e)}")


print("✅ MolShield main.py loaded successfully")