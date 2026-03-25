from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_api_health():
    """Basic health check"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_qec_shielding_pipeline():
    """Minimal test that matches our current dummy shield endpoint"""
    test_qasm = 'OPENQASM 2.0; include "qelib1.inc"; qreg q[1]; creg c[1]; h q[0]; measure q[0] -> c[0];'
    
    response = client.post(
        "/shield",
        json={"qasm_string": test_qasm, "error_rate": 0.05},
        headers={"X-API-Key": "molshield_hackathon_demo"}
    )
    
    print("Status code:", response.status_code)
    print("Response:", response.json())
    assert response.status_code == 200

def test_malformed_qasm_rejection():
    """Test malformed QASM rejection (optional for now)"""
    response = client.post(
        "/shield",
        json={"qasm_string": "INVALID QASM", "error_rate": 0.05}
    )
    assert response.status_code in [400, 422]