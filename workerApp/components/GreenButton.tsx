import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import React from 'react';

interface GreenButtonProps {
  onPress: () => void;
  title?: string;
}

const GreenButton: React.FC<GreenButtonProps> = ({ onPress, title = '' }) => (
  <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.6}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);
export default GreenButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0D9276',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
