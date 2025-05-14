import { StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import GreenButton from '../components/GreenButton';
import React from 'react';
import SharedStyles from '../styles/SharedStyles';
import { updateClientStatus } from '../redux/clientSlicer';

const StartTaskPage: React.FC = () => {
  const { currentClientId, clients } = useAppSelector((state) => state.client);
  const dispatch = useAppDispatch();

  const currentClient = clients.find((c) => c.id === currentClientId);

  if (!currentClient) {
    return (
      <View style={SharedStyles.centeredContainer}>
        <Text style={styles.noClientText}>Ingen pasient valgt</Text>
      </View>
    );
  }

  if (!currentClient.access) {
    return (
      <View style={SharedStyles.centeredContainer}>
        <Text style={styles.clientText}>
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
    dispatch(updateClientStatus({ status: 'Påbegynt' }));
  };

  return (
    <View style={SharedStyles.centeredContainer}>
      <Text style={styles.clientText}>{currentClient.name}</Text>
      <Text style={SharedStyles.message}>
        {currentClient.time} -{' '}
        {endTime(currentClient.time, currentClient.tasks)}
      </Text>
      {currentClient.status === 'Ikke startet' && (
        <GreenButton onPress={handleStart} title="Start besøk" />
      )}
      {currentClient.status === 'Ferdig' && (
        <View>
          <Text style={styles.clientText}>
            Oppgavene for {currentClient.name} er fullført.
          </Text>
        </View>
      )}
    </View>
  );
};

export default StartTaskPage;

const styles = StyleSheet.create({
  noClientText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center'
  },
  clientText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
    textAlign: 'center'
  }
});
