import { Text, View } from 'react-native';

import React from 'react';
import SharedStyles from '../styles/SharedStyles';
import { StyleSheet } from 'react-native';

interface UserInfoProps {
  label: string;
  value?: string;
}

const InfoText: React.FC<UserInfoProps> = ({ label, value }) => {
  return (
    <View style={styles.container}>
      <Text style={SharedStyles.cardTitle}>
        <Text style={styles.label}>{label}: </Text>
        {value || 'Ukjent'}
      </Text>
    </View>
  );
};

export default InfoText;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10
  },
  label: {
    fontWeight: 'bold'
  }
});
