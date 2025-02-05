import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import JournalRequest from './JournalRequest';
import PatientJournal from './PatientJournal';
import SharedStyles from '../styles/SharedStyles';
import { useAppSelector } from '../redux/hooks';

const JournalsPage: React.FC = () => {
  const { patients } = useAppSelector((state) => state.patient);
  const [selectedJournalPatient, setSelectedJournalPatient] =
    useState<any>(null);
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
    return <PatientJournal patient={selectedJournalPatient} onBack={onBack} />;
  }

  if (viewType === 'request' && selectedJournalPatient) {
    return <JournalRequest patient={selectedJournalPatient} onBack={onBack} />;
  }

  return (
    <View style={SharedStyles.container}>
      <Text style={SharedStyles.title}>Pasientjournaler</Text>
      {patients.map((patient) => {
        const accessText = patient.access
          ? 'Tilgang'
          : patient.accessRequest
            ? 'Bedt om tilgang'
            : 'Ikke tilgang';

        const accessStyle = patient.access
          ? styles.accessGranted
          : patient.accessRequest
            ? styles.accessRequested
            : styles.accessDenied;

        return (
          <TouchableOpacity
            key={patient.id}
            style={SharedStyles.patientCard}
            onPress={() => handlePatientPress(patient)}
          >
            <View>
              <Text style={SharedStyles.patientName}>{patient.name}</Text>
            </View>
            <Text style={accessStyle}>{accessText}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
export default JournalsPage;

const styles = StyleSheet.create({
  accessGranted: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D9276'
  },
  accessDenied: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D44F3A'
  },
  accessRequested: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D98A00'
  }
});
