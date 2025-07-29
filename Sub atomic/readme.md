4-Qubit Quantum State and Defect Simulation with Qiskit
This README will guide you through running two Qiskit programs:

1. 4-Qubit GHZ (Entangled) State Simulation

2. GHZ State with Intentionally Introduced Quantum Defect

You'll find installation instructions, library dependencies, code execution steps, and explanations to help you visualize quantum entanglement and investigate the impact of "defects" on a simple quantum system.

1. **Prerequisites and Libraries**
Required Python Version:
Python 3.13 (other Python 3.9+ versions should work, but this guide assumes 3.13 as per your environment).

Required Libraries:
Qiskit (core SDK, includes circuit building, transpiler, and visualization)
Qiskit Aer (high-performance quantum simulators)
matplotlib (for all graphical visualizations)
numpy (used for numerical operations in quantum programming)

To install the necessary packages inside your virtual environment, use:
pip install --upgrade pip
pip install qiskit qiskit-aer matplotlib numpy

2. Setting Up Your Python Virtual Environment
Activate your pre-created virtual environment (named qiskit-env in your case):

On Windows Command Prompt:
qiskit-env\Scripts\activate

3. How to Run the Programs
a. Running the 4-Qubit GHZ State Program
Purpose:
Simulates and visualizes a maximally entangled state (GHZ) across four qubits. Shows both the quantum statevector (amplitudes) and Bloch sphere visualizations.

Output:
You’ll see four Bloch spheres (each for a qubit); for the GHZ state, vectors appear at the center (maximally entangled).
Measurement histogram: shows two bars only at 0000 and 1111—signature of strong quantum correlation.

4. Running the 4-Qubit Defect Simulation Program
Purpose:
Extends the above with a deliberate "defect" (X, Y, or Z gate) on a selected qubit to study how local quantum disruptions affect entanglement and measurements.

Output:
Bloch spheres: potentially shows deviation for the defect qubit (if not fully entangled).
Statevector: amplitudes now shifted; may show only two basis states with complex coefficients, reflecting the altered quantum correlations.
Measurement histogram: new pattern, often with two peaks corresponding to rotated bitstrings (e.g., "0010" and "1101" for a Y-gate on qubit 1).

5. What You’ll See & How to Interpret Outputs
Bloch spheres: Show the local quantum state of each qubit; for full entanglement, these will be at the center. For a defect, the affected qubit might move outward (if not fully entangled).
Measurement histograms: For the unperturbed circuit, expect two peaks. For defected, expect the pattern to change depending on the type/position of the defect—valuable for studying quantum error effects.

6. Additional Notes:
Always activate your virtual environment before running or installing packages.
You can modify and experiment with different types/positions of defects to explore more quantum scenarios.
For visual debugging, always make sure plotting commands (plt.show()) are included if running scripts outside Jupyter Notebooks.
By following this README, you’ll be able to reproduce both the "clean" and "defect-introduced" 4-qubit quantum state simulations, analyze the quantum outputs, and visualize the results with industry-standard tools.
