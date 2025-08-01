from qiskit import QuantumCircuit, transpile
from qiskit_aer import Aer
from qiskit.circuit import Parameter
from qiskit.visualization import plot_bloch_multivector, plot_histogram
import matplotlib.pyplot as plt
import numpy as np
from scipy.optimize import minimize  # Use classical scipy optimizer
# Build parameterized quantum circuit (with a defect)
defect_qubit = 1  # Qubit to apply the parameterized defect (0-3)
theta = Parameter('θ')
qc = QuantumCircuit(4)
qc.h(0)
qc.cx(0, 1)
qc.cx(1, 2)
qc.cx(2, 3)
qc.ry(theta, defect_qubit)  # Variable-strength defect

# Define cost function
def calculate_cost(statevector):
    # Probability at least one qubit is excited (states 8-15 in the basis)
    prob_excited = np.sum(np.abs(statevector.data[8:])**2)
    return prob_excited

def cost_function(param_value):
    # param_value is an array-like: take first element as theta
    param_theta = param_value[0]
    param_dict = {theta: param_theta}
    bound_qc = qc.assign_parameters(param_dict)

    backend = Aer.get_backend('statevector_simulator')
    qc_sv = transpile(bound_qc, backend)
    statevector = backend.run(qc_sv).result().get_statevector()
    return calculate_cost(statevector)

# Optimize defect angle using classical scipy optimizer
initial_theta = 0.1  # Initial guess

result = minimize(cost_function, x0=[initial_theta], bounds=[(0, np.pi)], method='L-BFGS-B')  # Robust optimizer with bounds
optimal_angle = result.x[0]
print(f"Optimal defect angle (θ): {optimal_angle:.4f} radians")
print(f"Minimum excitation probability: {result.fun:.6f}")

# --- Step 4: Analyze and visualize the optimized state ---
optimized_qc = qc.assign_parameters({theta: optimal_angle})

backend_sv = Aer.get_backend('statevector_simulator')
qc_sv = transpile(optimized_qc, backend_sv)
statevector = backend_sv.run(qc_sv).result().get_statevector()

print("\nOptimized quantum statevector:\n", statevector)

# Bloch sphere visualization:
plot_bloch_multivector(statevector)
plt.show()

# Measurement simulation and histogram
optimized_qc.measure_all()
backend_qasm = Aer.get_backend('qasm_simulator')
qc_qasm = transpile(optimized_qc, backend_qasm)
counts = backend_qasm.run(qc_qasm, shots=1000).result().get_counts()
print("\nMeasurement counts with optimized defect:\n", counts)
plot_histogram(counts)
plt.show()
