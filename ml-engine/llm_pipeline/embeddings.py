"""
Sentiment embedding pipeline using sentence-transformers/all-MiniLM-L6-v2
Outputs 384-dimensional vectors stored in pgvector.
"""
from sentence_transformers import SentenceTransformer

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
_model = None

def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer(MODEL_NAME)
    return _model

def embed(texts: list[str]) -> list[list[float]]:
    """Return 384-dim embeddings for a batch of texts."""
    return get_model().encode(texts, convert_to_numpy=True).tolist()
