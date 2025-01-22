import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

import JournalRequestPage from '../components/JournalRequest';
import PatientJournalPage from '../components/PatientJournal';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

const JournalsPage: React.FC = () => {
  const { patients } = useSelector((state: RootState) => state.patient);
  const [selectedPatient, setSelectedPatient] = useState<any>(null); // Track the selected patient
  const [viewType, setViewType] = useState<'journal' | 'request' | null>(null); // View type for navigation

  const handlePatientPress = (patient: any) => {
    if (patient.access === 'Tilgang') {
      setSelectedPatient(patient);
      setViewType('journal'); // Navigate to PatientJournalPage
    } else {
      setSelectedPatient(patient);
      setViewType('request'); // Navigate to JournalRequestPage
    }
  };

  // Render the appropriate page based on the `viewType`
  if (viewType === 'journal' && selectedPatient) {
    return (
      <PatientJournalPage
        patient={selectedPatient}
        onBack={() => {
          setSelectedPatient(null);
          setViewType(null);
        }}
      />
    );
  }

  if (viewType === 'request' && selectedPatient) {
    return (
      <JournalRequestPage
        patient={selectedPatient}
        onBack={() => {
          setSelectedPatient(null);
          setViewType(null);
        }}
      />
    );
  }

  const renderPatient = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.patientCard} onPress={() => handlePatientPress(item)}>
      <Text style={styles.patientName}>{item.name}</Text>
      <Text
        style={
          item.access === 'Tilgang'
            ? styles.accessGranted
            : item.accessRequest
            ? styles.accessRequested // New style for "Bedt om tilgang"
            : styles.accessDenied
        }
      >
        {item.access === 'Tilgang'
          ? 'Tilgang'
          : item.accessRequest
          ? 'Bedt om tilgang'
          : 'Ikke tilgang'}
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
  accessRequested: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFA500', // Orange color for "Bedt om tilgang"
  },
});
