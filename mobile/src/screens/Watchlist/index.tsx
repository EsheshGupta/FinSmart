import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WatchlistScreen() {
  return (
    <View style={styles.container}>
      <Text>Watchlist</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
