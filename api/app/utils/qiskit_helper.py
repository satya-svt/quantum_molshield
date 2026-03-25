from qiskit import QuantumCircuit
from qiskit.qasm2 import dumps as qasm2_dumps

def qasm_to_circuit(qasm_string: str) -> QuantumCircuit:
    """Convert QASM string to QuantumCircuit object."""
    try:
        return QuantumCircuit.from_qasm_str(qasm_string)
    except Exception as e:
        raise ValueError(f"Invalid QASM: {str(e)}")


def circuit_to_qasm(qc: QuantumCircuit) -> str:
    """Convert QuantumCircuit to QASM string (modern Qiskit compatible)."""
    try:
        return qasm2_dumps(qc)
    except Exception:
        # Fallback
        return qc.draw(output="qasm", filename=None)