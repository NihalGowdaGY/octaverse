# Classical ML - Quantum Defect Classification

## Overview

This project demonstrates a hybrid **quantum-classical machine learning** approach to classify defects in a 4-qubit GHZ-like quantum state based on quantum circuit simulations.

The quantum circuit models a controlled "defect" introduced as a parameterized rotation (RY gate) on a specific qubit, affecting the resulting entangled state. The classical ML model then uses statevector features extracted from the simulated quantum states to classify the defect as **weak** or **strong**.

---

## Features

- **Quantum Data Generation:** Simulates a 4-qubit entangled circuit with a parameterized defect; extracts probabilities of key "defect signature" states and a coherence metric.
- **Classical Machine Learning:** Uses a Random Forest classifier trained on quantum simulation features to distinguish defect strength.
- **Interpretability:**  
  - Reports feature importance of quantum signatures.  
  - Visualizes decision boundary versus defect angle.
- **Robust Prediction:** Provides a function that simulates the quantum circuit at any defect angle to generate physically consistent features for classification.

---

## Technologies

- **Qiskit** (including `qiskit-aer` for quantum state simulation)
- **NumPy** for numeric operations
- **scikit-learn** for classical Random Forest classification
- **Matplotlib** for plotting feature importance and decision boundaries

---

## Usage

1. **Install requirements:**

   pip install qiskit qiskit-aer scikit-learn matplotlib numpy
   
2. **Run training and evaluation:**

   Execute the main script to generate quantum data, train the Random Forest classifier, and visualize results.

3. **Make predictions:**

   Use the provided `predict_defect(angle)` function with any defect angle input (in radians) to get a defect strength prediction with confidence based on accurate quantum simulation features.

---

## Example

print(predict_defect(0.1)) # Weak defect expected

print(predict_defect(1.5)) # Likely strong defect

print(predict_defect(2.8)) # Strong defect with high confidence

---

## What I Learned

- How to integrate quantum circuit simulation with classical machine learning.
- Meaningful feature engineering using quantum state probabilities and coherence.
- Importance of using physically consistent inputs for robust predictions.
- Visualization techniques for interpreting hybrid quantum-classical ML models.

---

## Future Work

- Extend dataset to include noise and larger quantum systems.
- Experiment with other classical ML models and quantum features.
- Integrate with real quantum device data.
- Explore explainability of quantum ML predictions.

---

This project showcases the synergy of quantum computing simulation and classical AI to identify quantum state defects, enabling novel quantum defect diagnostics with machine learning.
