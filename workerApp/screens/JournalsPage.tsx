import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

import JournalRequestPage from '../components/JournalRequest';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

const JournalsPage: React.FC = () => {
  const { patients } = useSelector((state: RootState) => state.patient);
  const [selectedPatient, setSelectedPatient] = useState(null); // Track selected patient for request

  const handlePatientPress = (patient: any) => {
    if (patient.access === 'Tilgang') {
      console.log('Navigate to detailed journal page (not implemented).');
    } else {
      setSelectedPatient(patient); // Open JournalRequestPage for patients without access
    }
  };

  if (selectedPatient) {
    // Render the JournalRequestPage when a patient without access is selected
    return <JournalRequestPage patient={selectedPatient} onBack={() => setSelectedPatient(null)} />;
  }

  const renderPatient = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.patientCard} onPress={() => handlePatientPress(item)}>
      <Text style={styles.patientName}>{item.name}</Text>
      <Text style={item.access === 'Tilgang' ? styles.accessGranted : styles.accessDenied}>
        {item.access}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pasientjournaler</Text>
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={renderPatient}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default JournalsPage;

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
    textAlign: 'center',
    color: '#333',
  },
  list: {
    flexGrow: 1,
    alignItems: 'center',
  },
  patientCard: {
    width: '90%',
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#D8EFF4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  accessGranted: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#006A70',
  },
  accessDenied: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF5733',
  },
});
