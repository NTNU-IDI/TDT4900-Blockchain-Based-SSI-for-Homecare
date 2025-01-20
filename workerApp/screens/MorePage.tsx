import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import React from 'react';

const MorePage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mer</Text>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => Alert.alert('Navigating to Innstillinger')}
      >
        <Text style={styles.optionText}>Innstillinger</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => Alert.alert('Navigating to Hjelp')}
      >
        <Text style={styles.optionText}>Hjelp</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => Alert.alert('Logging out...')}
      >
        <Text style={styles.optionText}>Logg ut</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MorePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  optionButton: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    color: '#006A70',
    fontWeight: '500',
  },
});
