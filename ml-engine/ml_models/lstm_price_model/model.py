"""
LSTM price prediction model (PyTorch).
Input:  sequence of OHLCV + technical features
Output: predicted_high, predicted_low, direction_probability
"""
import torch
import torch.nn as nn

class LSTMPriceModel(nn.Module):
    def __init__(self, input_size: int = 20, hidden_size: int = 128, num_layers: int = 2):
        super().__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, dropout=0.2)
        self.fc_high  = nn.Linear(hidden_size, 1)
        self.fc_low   = nn.Linear(hidden_size, 1)
        self.fc_dir   = nn.Sequential(nn.Linear(hidden_size, 1), nn.Sigmoid())

    def forward(self, x: torch.Tensor):
        out, _ = self.lstm(x)
        last = out[:, -1, :]
        return self.fc_high(last), self.fc_low(last), self.fc_dir(last)
