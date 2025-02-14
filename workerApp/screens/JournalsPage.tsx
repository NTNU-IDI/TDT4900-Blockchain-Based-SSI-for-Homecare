import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import JournalRequest from './JournalRequest';
import { Patient } from '../types/patientInterfaces';
import PatientJournal from './PatientJournal';
import SharedStyles from '../styles/SharedStyles';
import { fetchAccessStatus } from '../redux/patientSlicer';
import { useFocusEffect } from '@react-navigation/native';

const JournalsPage: React.FC = () => {
  const { patients } = useAppSelector((state) => state.patient);
  const [selectedJournalPatient, setSelectedJournalPatient] =
    useState<Patient>();
  const [viewType, setViewType] = useState<'journal' | 'request' | null>(null);
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
      patients.forEach((patient) => 
        dispatch(
          fetchAccessStatus({
            patientId: patient.id,
            currentAccessStatus: patient.access}))
        );
    }, [dispatch, patients])
  );

  const handlePatientPress = (patient: Patient) => {
    if (patient.accessRequest) {
      return console.log('Access already requested for', patient.name);
    }
    setSelectedJournalPatient(patient);
    setViewType(patient.access ? 'journal' : 'request');
  };

  const onBack = () => {
    setSelectedJournalPatient(undefined);
    setViewType(null);
  };

  if (viewType === 'journal' && selectedJournalPatient) {
    return <PatientJournal patient={selectedJournalPatient} onBack={onBack} />;
  }

  if (viewType === 'request' && selectedJournalPatient) {
    return <JournalRequest patient={selectedJournalPatient} onBack={onBack} />;
  }

  const ACCESS_COLORS = {
    granted: '#0D9276',
    denied: '#D44F3A',
    requested: '#D98A00',
  };
  
  const getAccessText = (patient: Patient) => {
    if (patient.access) return 'Tilgang';
    if (patient.accessRequest) return 'Bedt om tilgang';
    return 'Ikke tilgang';
  };

  const getAccessStyle = (patient: Patient) => ({
    ...SharedStyles.boldCardTitle,
    color: patient.access
      ? ACCESS_COLORS.granted
      : patient.accessRequest
      ? ACCESS_COLORS.requested
      : ACCESS_COLORS.denied,
  });

  return (
    <View style={SharedStyles.container}>
      <Text style={SharedStyles.title}>Pasientjournaler</Text>
      {patients.map((patient) => (
          <TouchableOpacity
            key={patient.id}
            style={SharedStyles.patientCard}
            onPress={() => handlePatientPress(patient)}
          >
            <View>
              <Text style={SharedStyles.boldCardTitle}>{patient.name}</Text>
            </View>
            <Text style={getAccessStyle(patient)}>{getAccessText(patient)}</Text>
          </TouchableOpacity>))}
    </View>
  );
};
export default JournalsPage;