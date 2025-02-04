import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import BackButton from '../components/BackButton';
import GreenButton from '../components/GreenButton';
import SharedStyles from '../styles/SharedStyles';
import { requestPatientAccess } from '../redux/patientSlicer';

const JournalRequest: React.FC<{ patient: any; onBack: () => void }> = ({
  patient,
  onBack
}) => {
  const dispatch = useAppDispatch();
  const workerData = useAppSelector((state) => state.worker.worker);
  const [requestSent, setRequestSent] = useState(false);
  const [note, setNote] = useState('');

  const handleRequestAccess = () => {
    dispatch(requestPatientAccess({patientId: patient.id, note}));
    setRequestSent(true);
    setTimeout(() => onBack(), 2000);
  };

  return (
    <View style={SharedStyles.container}>
      <BackButton onPress={onBack} />
      <Text style={SharedStyles.title}>Be om tilgang til journal</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Navn: </Text>
          {workerData?.navn || 'Ukjent'}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Arbeidsplass: </Text>
          {workerData?.arbeidsplass || 'Ukjent'}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Yrke: </Text>
          {workerData?.yrke || 'Ukjent'}
        </Text>
      </View>

      {!requestSent ? (
        <>
          <TextInput
            style={SharedStyles.noteInput}
            placeholder="Legg til notat her..."
            multiline
            value={note}
            onChangeText={setNote}
          />
          <GreenButton onPress={handleRequestAccess} title="Send forespørsel" />
        </>
      ) : (
        <View style={styles.requestSentContainer}>
          <Text style={styles.requestSentText}>Forespørsel sendt</Text>
        </View>
      )}
    </View>
  );
};

export default JournalRequest;

const styles = StyleSheet.create({
  infoContainer: {
    marginBottom: 20
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10
  },
  label: {
    fontWeight: 'bold'
  },
  requestSentContainer: {
    backgroundColor: '#BBE2EC',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  requestSentText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold'
  }
});
