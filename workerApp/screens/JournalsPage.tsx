import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

import JournalRequest from '../components/JournalRequest';
import PatientJournal from '../components/PatientJournal';
import { useAppSelector } from '../redux/hooks';

const JournalsPage: React.FC = () => {
  const { patients } = useAppSelector((state) => state.patient);
  const [selectedJournalPatient, setSelectedJournalPatient] = useState<any>(null);
  const [viewType, setViewType] = useState<'journal' | 'request' | null>(null);

  const handlePatientPress = (patient: any) => {
    setSelectedJournalPatient(patient);
    if (patient.access === 'Tilgang') {
      setViewType('journal');
    } else {
      setViewType('request');
    }
  };

  const onBack = () => {
    setSelectedJournalPatient(null);
    setViewType(null);
  };

  if (viewType === 'journal' && selectedJournalPatient) {
    return (
      <PatientJournal
        patient={selectedJournalPatient}
        onBack={onBack}
      />
    );
  }

  if (viewType === 'request' && selectedJournalPatient) {
    return (
      <JournalRequest
        patient={selectedJournalPatient}
        onBack={onBack}
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
            ? styles.accessRequested
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
  },
  patientCard: {
    backgroundColor: '#D8EFF4',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
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
    color: '#FFA500',
  },
})

