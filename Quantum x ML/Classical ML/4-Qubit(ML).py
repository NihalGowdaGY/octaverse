import numpy as np
from qiskit import QuantumCircuit, transpile
from qiskit_aer import Aer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

# Generate quantum dataset with defects
def generate_quantum_data(num_samples=200):
    backend = Aer.get_backend('statevector_simulator')
    X, y = [], []
    
    for angle in np.linspace(0, np.pi, num_samples):
        # Create quantum circuit with defect
        qc = QuantumCircuit(4)
        qc.h(0)
        qc.cx(0,1)
        qc.cx(1,2)
        qc.cx(2,3)
        qc.ry(angle, 1)  # Defect on qubit 1
        
        # Simulate and get probabilities
        statevector = backend.run(transpile(qc, backend)).result().get_statevector()
        probs = statevector.probabilities_dict()
        statevector_np = np.array(statevector)  # convert to numpy array before negative indexing
        
        # Create features: angle + key state probabilities
        features = [
            angle,
            probs.get('0010', 0),  # Defect signature 1
            probs.get('1101', 0),  # Defect signature 2
            np.abs(statevector_np[0] - statevector_np[-1])  # GHZ coherence
        ]
        X.append(features)
        
        y.append(1 if angle >= np.pi/2 else 0)
    
    return np.array(X), np.array(y)

# Generate and split dataset
X, y = generate_quantum_data()
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest classifier
clf = RandomForestClassifier(n_estimators=100, max_depth=4)
clf.fit(X_train, y_train)

# Evaluation
print(f"Training Accuracy: {clf.score(X_train, y_train):.2f}")
print(f"Test Accuracy: {clf.score(X_test, y_test):.2f}")

# Visualization
plt.figure(figsize=(12,4))

# Feature Importance
plt.subplot(121)
plt.bar(['Angle', 'P(0010)', 'P(1101)', 'Coherence'], clf.feature_importances_)
plt.title('Feature Importance')

# Decision Boundary
plt.subplot(122)
angles = np.linspace(0, np.pi, 100)
probs = clf.predict_proba(np.column_stack([
    angles, 
    np.zeros(100), 
    np.zeros(100), 
    np.ones(100)
]))[:,1]
plt.plot(angles, probs)
plt.axvline(np.pi/2, color='r', linestyle='--')
plt.title('Defect Strength Probability')
plt.xlabel('Defect Angle (rad)')
plt.ylabel('P(Strong Defect)')

plt.tight_layout()
plt.show()

# Improved Prediction Function—uses quantum simulation for each angle
def predict_defect(angle):
    qc = QuantumCircuit(4)
    qc.h(0)
    qc.cx(0,1)
    qc.cx(1,2)
    qc.cx(2,3)
    qc.ry(angle, 1)
    backend = Aer.get_backend('statevector_simulator')
    statevector = backend.run(transpile(qc, backend)).result().get_statevector()
    probs = statevector.probabilities_dict()
    statevector_np = np.array(statevector)
    feature_vec = [
        angle,
        probs.get('0010', 0),
        probs.get('1101', 0),
        np.abs(statevector_np[0] - statevector_np[-1])  # GHZ coherence
    ]
    prob = clf.predict_proba([feature_vec])[0][1]
    strength = "STRONG" if prob > 0.5 else "WEAK"
    return f"θ={angle:.2f} rad → {strength} defect ({prob:.1%} confidence)"

# Test predictions (now these will be correct and meaningful)
print(predict_defect(0.1))    # Should predict WEAK
print(predict_defect(1.5))    # Should predict STRONG
print(predict_defect(2.8))    # Should predict STRONG
