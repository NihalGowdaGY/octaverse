from qiskit import QuantumCircuit, transpile
from qiskit_aer import Aer
from qiskit.circuit import ParameterVector
from qiskit.visualization import plot_bloch_multivector, plot_histogram
import matplotlib.pyplot as plt
import numpy as np
from scipy.optimize import minimize

# -------- PARAMETERS --------
num_qubits = 4
defect_thetas = ParameterVector('θ', num_qubits)

# -------- CIRCUIT CREATION WITH MULTI-QUBIT DEFECT --------
def create_circuit(defect_angles=None):
    qc = QuantumCircuit(num_qubits)
    # GHZ preparation
    qc.h(0)
    for i in range(num_qubits - 1):
        qc.cx(i, i+1)
    # Apply RY defect rotations on all qubits
    if defect_angles is None:
        # Parameterized angles (symbolic)
        for i in range(num_qubits):
            qc.ry(defect_thetas[i], i)
    else:
        # Numerical angles provided
        for i in range(num_qubits):
            qc.ry(defect_angles[i], i)
    return qc

# -------- COST FUNCTION: MINIMIZE EXCITATION --------
def calculate_cost(statevector):
    probs = statevector.probabilities_dict()
    excitation = sum(prob for state, prob in probs.items() if state != '0000')
    return excitation

def cost_function(param_values):
    qc = create_circuit(param_values)
    backend = Aer.get_backend('statevector_simulator')
    qc_sv = transpile(qc, backend)
    statevector = backend.run(qc_sv).result().get_statevector()
    return calculate_cost(statevector)

# -------- RUN OPTIMIZATION --------
initial_guess = [0.0] * num_qubits  # Start with no rotations
bounds = [(0, np.pi)] * num_qubits  # Bounds for each angle

result = minimize(
    cost_function,
    x0=initial_guess,
    bounds=bounds,
    method='L-BFGS-B',
    options={'maxfun': 500}
)

optimal_thetas = result.x
print("\nOptimal defect angles (radians):")
for i, angle in enumerate(optimal_thetas):
    print(f"Qubit {i}: θ = {angle:.4f} rad ({np.degrees(angle):.1f}°)")

print(f"\nMinimum total excitation: {result.fun:.6f}")

# -------- FINAL STATE ANALYSIS --------
qc_opt = create_circuit(optimal_thetas)
backend_sv = Aer.get_backend('statevector_simulator')
statevector = backend_sv.run(transpile(qc_opt, backend_sv)).result().get_statevector()

# -------- PRINT PROBABILITIES IN PERCENT --------
probs = statevector.probabilities_dict()
probs_pct = {state: 100 * prob for state, prob in probs.items()}

print("\nTop state probabilities (%):")
for state in sorted(probs_pct, key=probs_pct.get, reverse=True)[:5]:
    print(f"{state}: {probs_pct[state]:.1f}%")

# -------- BLOCH MULTIVECTOR VISUALIZATION --------
plt.figure()
plot_bloch_multivector(statevector)
plt.suptitle("Bloch Multivector with Optimized Multi-Qubit Defect")
plt.show()

# -------- MEASUREMENT HISTOGRAM WITH PERCENTAGES --------
qc_opt.measure_all()
backend_qasm = Aer.get_backend('qasm_simulator')
counts = backend_qasm.run(transpile(qc_opt, backend_qasm), shots=1000).result().get_counts()
counts_pct = {state: 100 * count / 1000 for state, count in counts.items()}

print("\nMeasurement histogram (%):")
for state in sorted(counts_pct, key=counts_pct.get, reverse=True)[:5]:
    print(f"{state}: {counts_pct[state]:.1f}%")

plt.figure()
plot_histogram(counts_pct)
plt.title("Measurement Results (Percentages)")
plt.ylabel("Probability (%)")
plt.show()
