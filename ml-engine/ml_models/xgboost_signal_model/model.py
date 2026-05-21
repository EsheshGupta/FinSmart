"""
XGBoost signal classifier.
Input:  feature vector (OHLCV + technicals + sentiment + LSTM outputs + macro)
Output: signal direction (BUY/SELL/HOLD) + confidence score
"""
import xgboost as xgb
import numpy as np

LABEL_MAP = {0: "HOLD", 1: "BUY", 2: "SELL"}

class SignalClassifier:
    def __init__(self, model_path: str | None = None):
        self.model = xgb.XGBClassifier() if model_path is None else xgb.XGBClassifier()
        if model_path:
            self.model.load_model(model_path)

    def predict(self, features: np.ndarray) -> tuple[str, float]:
        proba = self.model.predict_proba(features)[0]
        label_idx = int(np.argmax(proba))
        return LABEL_MAP[label_idx], float(proba[label_idx])
