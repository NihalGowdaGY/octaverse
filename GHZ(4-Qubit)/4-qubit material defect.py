from qiskit import QuantumCircuit, transpile
from qiskit_aer import Aer
from qiskit.visualization import plot_bloch_multivector, plot_histogram
import matplotlib.pyplot as plt
import numpy as np

# Create a 4-qubit circuit
qc = QuantumCircuit(4)

# Simulate electron sharing (covalent bonds)
qc.h(0)
qc.cx(0, 1)
qc.cx(1, 2)
qc.cx(2, 3)

#  DEFECT SIMULATION 
# Choose one or more defect types (uncomment to activate)
defect_qubit = 1  # Which atom has the defect (0-3)

# 1. Particle displacement (X-gate)
# qc.x(defect_qubit)

# 2. Phase defect (Z-gate)
# qc.z(defect_qubit)

# 3. Combined defect (Y-gate)
qc.y(defect_qubit)

# 4. Missing atom (remove all gates to this qubit)
# Just don't apply any gates to the defect_qubit

# CONTINUE WITH YOUR EXISTING CODE
print("\nCircuit with defect:")
print(qc)

# Statevector simulation
backend_sv = Aer.get_backend('statevector_simulator')
qc_sv = transpile(qc, backend_sv)
job_sv = backend_sv.run(qc_sv)
statevector = job_sv.result().get_statevector()

# Visualize
print("\nBloch spheres showing defect effects:")
plot_bloch_multivector(statevector)
plt.show()

print("\nQuantum statevector with defect:\n", statevector)

# Measurement simulation
qc.measure_all()
backend_qasm = Aer.get_backend('qasm_simulator')
qc_qasm = transpile(qc, backend_qasm)
job_qasm = backend_qasm.run(qc_qasm, shots=1000)
counts = job_qasm.result().get_counts()

print("\nMeasurement counts with defect:")
plot_histogram(counts)
plt.show()
