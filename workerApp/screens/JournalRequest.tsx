import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import BackButton from '../components/BackButton';
import GreenButton from '../components/GreenButton';
import InfoText from '../components/InfoText';
import { Patient } from '../types/patientInterfaces';
import SharedStyles from '../styles/SharedStyles';
import { requestPatientAccess } from '../redux/patientSlicer';

const JournalRequest: React.FC<{ patient: Patient; onBack: () => void }> = ({
  patient,
  onBack
}) => {
  const dispatch = useAppDispatch();
  const workerData = useAppSelector((state) => state.worker.worker);
  const [requestSent, setRequestSent] = useState(false);
  const [note, setNote] = useState('');

  const handleRequestAccess = () => {
    dispatch(requestPatientAccess({ patientId: patient.id, note }));
    setRequestSent(true);
    setTimeout(onBack, 2000);
  };

  return (
    <View style={SharedStyles.container}>
      <View style={SharedStyles.headerContainer}>
        <BackButton onPress={onBack} />
        <Text style={SharedStyles.headerTitle}>Be om tilgang til journal</Text>
      </View>
      <View style={{ marginBottom: 20 }}>
        <InfoText label="Ditt navn" value={workerData?.name} />
        <InfoText label="Din arbeidsplass" value={workerData?.workplace} />
        <InfoText label="Ditt yrke" value={workerData?.job} />
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
        <View style={SharedStyles.card}>
          <Text style={SharedStyles.boldCardTitle}>Forespørsel sendt</Text>
        </View>
      )}
    </View>
  );
};

export default JournalRequest;
