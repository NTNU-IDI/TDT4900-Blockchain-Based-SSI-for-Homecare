import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import React from 'react';
import SharedStyles from '../styles/SharedStyles';
import { setCurrentPatient } from '../redux/patientSlicer';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentPatientId, patients } = useAppSelector(
    (state) => state.patient
  );

  const currentDate = new Date().toLocaleDateString('no-NO', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const currentDateFormatted = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  return (
    <View style={SharedStyles.container}>
      <Text style={SharedStyles.title}>{currentDateFormatted}</Text>
      {patients.map((patient) => {
        const isCurrentPatient = currentPatientId === patient.id;

        return (
          <TouchableOpacity
            style={[
              SharedStyles.patientCard,
              isCurrentPatient && styles.currentPatientCard
            ]}
            onPress={() => dispatch(setCurrentPatient(patient.id))}
          >
            <View>
              <Text
                style={[
                  SharedStyles.boldCardTitle,
                  isCurrentPatient && styles.currentPatientName
                ]}
              >
                {patient.name}
              </Text>
              {!patient.access && (
                <>
                  <Text style={styles.noAccessMessage}>
                    "Ingen tilgang. Be om tilgang på journalsiden."
                  </Text>
                </>
              )}
    
              {patient.access && (
                <>
                  <Text
                    style={[
                      styles.patientInfo,
                      isCurrentPatient && styles.currentPatientInfo
                    ]}
                  >
                    {patient.time} - {patient.address}
                  </Text>
                  <Text
                    style={[
                      SharedStyles.greyCardText,
                      isCurrentPatient && styles.currentPatientKey
                    ]}
                  >
                    Nøkkelnummer: {patient.nøkkelnummer}
                  </Text>
                </>
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
    marginTop: 5
  }
});
