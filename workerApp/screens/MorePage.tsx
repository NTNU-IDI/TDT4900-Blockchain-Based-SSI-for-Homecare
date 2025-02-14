import { Text, TouchableOpacity, View } from 'react-native';

import React from 'react';
import SharedStyles from '../styles/SharedStyles';

const MorePage: React.FC = () => {
  return (
    <View style={SharedStyles.container}>
      <Text style={SharedStyles.title}>Mer</Text>
      <TouchableOpacity style={SharedStyles.patientCard}>
        <Text style={SharedStyles.boldCardTitle}>Innstillinger</Text>
      </TouchableOpacity>
      <TouchableOpacity style={SharedStyles.patientCard}>
        <Text style={SharedStyles.boldCardTitle}>Hjelp</Text>
      </TouchableOpacity>
      <TouchableOpacity style={SharedStyles.patientCard}>
        <Text style={SharedStyles.boldCardTitle}>Logg ut</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MorePage;