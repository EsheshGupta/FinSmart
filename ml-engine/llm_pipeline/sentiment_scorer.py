"""
Computes per-company sentiment score [-1, +1] from embeddings.
Cosine similarity against pre-built bullish/bearish centroid vectors.
"""
import numpy as np

def cosine_sim(a: list[float], b: list[float]) -> float:
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-8))

def score(embedding: list[float], bullish_centroid: list[float], bearish_centroid: list[float]) -> float:
    """Returns score in [-1, +1]. Positive = bullish, Negative = bearish."""
    bull = cosine_sim(embedding, bullish_centroid)
    bear = cosine_sim(embedding, bearish_centroid)
    return round(bull - bear, 4)
