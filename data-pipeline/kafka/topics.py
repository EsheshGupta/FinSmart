"""
FinSmart Kafka Topic Registry
All topic names defined in one place — import from here, never hardcode.
"""

# Market data
TOPIC_MARKET_RAW_OHLCV         = "market.raw.ohlcv"
TOPIC_MARKET_PROCESSED_OHLCV   = "market.processed.ohlcv"
TOPIC_MARKET_FUNDAMENTALS      = "market.fundamentals"
TOPIC_MARKET_ORDER_BOOK        = "market.order_book"
TOPIC_MARKET_FO_DATA           = "market.fo_data"

# Sentiment
TOPIC_SENTIMENT_RAW            = "sentiment.raw"
TOPIC_SENTIMENT_VECTORS        = "sentiment.vectors"

# Signals
TOPIC_SIGNAL_GENERATED         = "signal.generated"
TOPIC_NOTIFICATION_TRIGGER     = "notification.trigger"

# Corporate events
TOPIC_CORPORATE_EVENTS         = "corporate.events"
