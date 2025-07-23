from qiskit import QuantumCircuit, Aer, execute  
import numpy as np  

# Step 1: Create a 4-qubit circuit (represents 4 atoms in a lattice)  
qc = QuantumCircuit(4)  

# Step 2: Simulate electron sharing (covalent bonds)  
qc.h(0)                 # Superpose electron on Atom 0 (quantum weirdness!)  
qc.cx(0, 1)             # Entangle Atom 0 & 1 (shared electron pair)  
qc.cx(1, 2)             # Propagate entanglement down the chain  
qc.cx(2, 3)  

# Step 3: Simulate & visualize  
backend = Aer.get_backend('statevector_simulator')  
result = execute(qc, backend).result()  
statevector = result.get_statevector()  
print("Quantum state of your 4-atom lattice:\n", statevector)  