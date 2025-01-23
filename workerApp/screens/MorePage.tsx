import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import React from 'react';
import SharedStyles from '../styles/SharedStyles';

const MorePage: React.FC = () => {
  return (
    <View style={SharedStyles.container}>
      <Text style={SharedStyles.title}>Mer</Text>
      <TouchableOpacity style={SharedStyles.patientCard}>
        <Text style={styles.text}>Innstillinger</Text>
      </TouchableOpacity>
      <TouchableOpacity style={SharedStyles.patientCard}>
        <Text style={styles.text}>Hjelp</Text>
      </TouchableOpacity>
      <TouchableOpacity style={SharedStyles.patientCard}>
        <Text style={styles.text}>Logg ut</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MorePage;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#black',
    fontWeight: '500'
  }
});
