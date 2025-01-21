import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { RootState, setCurrentPatient } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';

import styles from '../styles/HomeStyles';

const HomePage: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('no-NO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  
  const { currentPatientId, patients } = useSelector((state: RootState) => state.patient);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>I dag</Text>
      {patients.map((patient) => (
        <TouchableOpacity
          key={patient.id}
          style={[
            styles.patientCard,
            currentPatientId === patient.id && styles.currentPatientCard,
          ]}
          onPress={() => dispatch(setCurrentPatient(patient.id))}
        >
          <View>
            <Text style={styles.patientName}>{patient.name}</Text>
            <Text style={styles.patientInfo}>{patient.time} - {patient.address}</Text>
            {patient.nøkkelnummer ? (
              <Text style={styles.patientKey}>Nøkkelnummer: {patient.nøkkelnummer}</Text>
            ) : null}
          </View>
          <Text style={styles.patientStatus}>{patient.status}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default HomePage;