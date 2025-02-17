import { StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import GreenButton from '../components/GreenButton';
import React from 'react';
import SharedStyles from '../styles/SharedStyles';
import { updatePatientStatus } from '../redux/patientSlicer';

const StartTaskPage: React.FC = () => {
  const { currentPatientId, patients } = useAppSelector(
    (state) => state.patient
  );
  const dispatch = useAppDispatch();

  const currentPatient = patients.find((p) => p.id === currentPatientId);

  if (!currentPatient) {
    return (
      <View style={SharedStyles.centeredContainer}>
        <Text style={styles.noPatientText}>Ingen pasient valgt</Text>
      </View>
    );
  }

  if (!currentPatient.access) {
    return (
      <View style={SharedStyles.centeredContainer}>
        <Text style={styles.patientText}>
          Du har ikke tilgang til gjøremål for denne brukeren.
        </Text>
        <Text style={SharedStyles.message}>Be om tilgang på journalsiden.</Text>
      </View>
    );
  }

  const endTime = (
    startTime: string,
    tasks: { duration: number }[]
  ): string => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const totalDuration = tasks.reduce((sum, task) => sum + task.duration, 0);
    const endTime = new Date();
    endTime.setHours(startHour, startMinute + totalDuration);

    return endTime.toTimeString().slice(0, 5);
  };

  const handleStart = () => {
    dispatch(updatePatientStatus({ status: 'Påbegynt' }));
  };

  return (
    <View style={SharedStyles.centeredContainer}>
      <Text style={styles.patientText}>{currentPatient.name}</Text>
      <Text style={SharedStyles.message}>
        {currentPatient.time} -{' '}
        {endTime(currentPatient.time, currentPatient.tasks)}
      </Text>
      {currentPatient.status === 'Ikke startet' && (
        <GreenButton onPress={handleStart} title="Start besøk" />
      )}
      {currentPatient.status === 'Ferdig' && (
        <View>
          <Text style={styles.patientText}>
            Oppgavene for {currentPatient.name} er fullført.
          </Text>
        </View>
      )}
    </View>
  );
};

export default StartTaskPage;

const styles = StyleSheet.create({
  noPatientText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center'
  },
  patientText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
    textAlign: 'center'
  }
});
