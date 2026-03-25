from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister

def encode_logical(qc: QuantumCircuit, target, ancillary) -> QuantumCircuit:
    """
    5-qubit repetition encoding.
    Spreads the logical qubit (target) across 5 physical qubits using CNOTs.
    Works with both int indices and Qubit objects.
    """
    # Convert to index if Qubit object is passed
    target_idx = target if isinstance(target, int) else qc.find_bit(target).index
    
    for anc in ancillary:
        anc_idx = anc if isinstance(anc, int) else qc.find_bit(anc).index
        qc.cx(target_idx, anc_idx)
    
    return qc


def insert_syndrome_circuit(qc: QuantumCircuit, data_qubits, syndrome_qubits, c_synd: ClassicalRegister) -> QuantumCircuit:
    """
    Inserts syndrome measurements for the 5-qubit repetition code.
    Measures parity between neighboring qubits to detect bit-flip errors.
    """
    # Convert to indices safely
    data_idx = [i if isinstance(i, int) else qc.find_bit(i).index for i in data_qubits]
    synd_idx = [i if isinstance(i, int) else qc.find_bit(i).index for i in syndrome_qubits]
    
    if len(data_idx) != 5 or len(synd_idx) != 4:
        raise ValueError("Repetition code requires 5 data qubits and 4 syndrome qubits.")
    
    for i in range(4):
        qc.cx(data_idx[i], synd_idx[i])      # parity check
        qc.cx(data_idx[i + 1], synd_idx[i])  # parity check
        qc.measure(synd_idx[i], c_synd[i])   # measure syndrome
        qc.reset(synd_idx[i])                # reset for next round
    
    return qc