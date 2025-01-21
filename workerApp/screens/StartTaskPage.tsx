import { RootState, updatePatientStatus } from '../redux/store';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import React from 'react';

const StartTaskPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { currentPatientId, patients } = useSelector((state: RootState) => state.patient);
  const dispatch = useDispatch();

  const currentPatient = patients.find((p) => p.id === currentPatientId);

  console.log('Current Patient:', currentPatient); // Debugging

  const handleStart = () => {
    dispatch(updatePatientStatus({ id: currentPatient!.id, status: 'Påbegynt' }));
  };

  if (!currentPatient) {
    return (
      <View style={styles.container}>
        <Text style={styles.noPatientText}>Ingen pasient er valgt</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.patientText}>{currentPatient.name}</Text>
      {currentPatient.status === 'Ikke startet' ? (
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>Start besøk</Text>
        </TouchableOpacity>
      ) : currentPatient.status === 'Ferdig' ? (
        <View>
          <Text style={styles.message}>
            Oppgavene for {currentPatient.name} er fullført.
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default StartTaskPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPatientText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  patientText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  startButton: {
    backgroundColor: '#006A70',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  viewTasksButton: {
    backgroundColor: '#004D40',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewTasksButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
