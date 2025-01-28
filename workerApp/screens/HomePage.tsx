import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import React from 'react';
import SharedStyles from '../styles/SharedStyles';
import { setCurrentPatient } from '../redux/patientSlicer';

const HomePage: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('no-NO', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const { currentPatientId, patients } = useAppSelector(
    (state) => state.patient
  );
  const dispatch = useAppDispatch();

  return (
    <View style={SharedStyles.container}>
      <Text style={SharedStyles.title}>
        {currentDate[0].toUpperCase() + currentDate.slice(1)}
      </Text>
      {patients.map((patient) => {
        const isCurrentPatient = currentPatientId === patient.id;
        const noAccessMessage = !patient.access
          ? 'Ingen tilgang. Be om tilgang på journalsiden.'
          : null;

        return (
          <TouchableOpacity
            key={patient.id}
            style={[
              SharedStyles.patientCard,
              isCurrentPatient && styles.currentPatientCard
            ]}
            onPress={() => dispatch(setCurrentPatient(patient.id))}
          >
            <View>
              <Text
                style={[
                  SharedStyles.patientName,
                  isCurrentPatient && styles.currentPatientName
                ]}
              >
                {patient.name}
              </Text>
              {patient.access && patient.time && (
                <Text
                  style={[
                    styles.patientInfo,
                    isCurrentPatient && styles.currentPatientInfo
                  ]}
                >
                  {patient.time} - {patient.address}
                </Text>
              )}
              {patient.nøkkelnummer && patient.access && (
                <Text
                  style={[
                    styles.patientKey,
                    isCurrentPatient && styles.currentPatientKey
                  ]}
                >
                  Nøkkelnummer: {patient.nøkkelnummer}
                </Text>
              )}
              {noAccessMessage && (
                <Text style={styles.noAccessMessage}>{noAccessMessage}</Text>
              )}
            </View>
            <Text
              style={[
                styles.patientStatus,
                isCurrentPatient && styles.currentPatientStatus
              ]}
            >
              {patient.status}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  currentPatientCard: {
    backgroundColor: '#0D9276',
    borderWidth: 2,
    borderColor: '#00B3B3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  currentPatientName: {
    color: '#FFFFFF'
  },
  patientInfo: {
    fontSize: 14,
    color: '#444'
  },
  currentPatientInfo: {
    color: '#E0FFFF'
  },
  patientKey: {
    fontSize: 14,
    color: '#555'
  },
  currentPatientKey: {
    color: '#E0FFFF'
  },
  patientStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333'
  },
  currentPatientStatus: {
    color: '#FFFFFF'
  },
  noAccessMessage: {
    fontSize: 14,
    color: '#D44F3A',
    fontStyle: 'italic',
    marginTop: 5
  }
});
