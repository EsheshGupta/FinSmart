"""
bloomberg_adapter — Plug-in connector
Inactive until API credentials and feature flag are configured.
Set env var FEATURE_FLAG_BLOOMBERG_ADAPTER=true to enable.
"""
import os

ENABLED = os.getenv("FEATURE_FLAG_BLOOMBERG_ADAPTER", "false").lower() == "true"

def start():
    if not ENABLED:
        raise RuntimeError("bloomberg_adapter is disabled. Set FEATURE_FLAG_BLOOMBERG_ADAPTER=true to activate.")
    # TODO: implement adapter logic
