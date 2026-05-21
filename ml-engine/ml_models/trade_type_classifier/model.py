"""
Logistic regression classifier: Intraday vs Delivery signal.
Input:  momentum indicators, holding-period return estimates
Output: INTRADAY | DELIVERY
"""
from sklearn.linear_model import LogisticRegression
import numpy as np

class TradeTypeClassifier:
    def __init__(self):
        self.model = LogisticRegression()

    def predict(self, features: np.ndarray) -> str:
        pred = self.model.predict(features)[0]
        return "INTRADAY" if pred == 1 else "DELIVERY"
