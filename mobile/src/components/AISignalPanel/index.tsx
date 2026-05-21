import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Signal {
  direction: 'BUY' | 'SELL' | 'HOLD';
  tradeType: 'INTRADAY' | 'DELIVERY';
  targetPrice: number;
  stopLoss: number;
  confidenceScore: number;
  reasoningSnippet: string;
}

interface Props {
  signal: Signal;
  onExpand: () => void;
}

export function AISignalPanel({ signal, onExpand }: Props) {
  return (
    <TouchableOpacity style={styles.panel} onPress={onExpand}>
      <Text style={styles.direction}>{signal.direction}</Text>
      <Text>{signal.tradeType}</Text>
      <Text>Target: {signal.targetPrice}</Text>
      <Text>Stop-loss: {signal.stopLoss}</Text>
      <Text>Confidence: {Math.round(signal.confidenceScore * 100)}%</Text>
      <Text>{signal.reasoningSnippet}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#F0FFF4',
    padding: 16,
    borderRadius: 12,
    margin: 8,
    elevation: 3,
  },
  direction: { fontSize: 18, fontWeight: 'bold' },
});
