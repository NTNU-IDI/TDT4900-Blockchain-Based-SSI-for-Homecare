import { Text, TouchableOpacity, View } from 'react-native'
import { useAppDispatch, useAppSelector } from '../redux/hooks'

import React from 'react'
import { setCurrentPatient } from '../redux/patientSlicer'
import styles from '../styles/HomeStyles'

const HomePage: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('no-NO', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }) 
  
  const { currentPatientId, patients } = useAppSelector((state) => state.patient) 
  const dispatch = useAppDispatch() 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>I dag</Text>
      {patients.map((patient) => {
        const isCurrentPatient = currentPatientId === patient.id 
  
        return (
          <TouchableOpacity
            key={patient.id}
            style={[
              styles.patientCard,
              isCurrentPatient && styles.currentPatientCard,
            ]}
            onPress={() => dispatch(setCurrentPatient(patient.id))}
          >
            <View>
              <Text
                style={[
                  styles.patientName,
                  isCurrentPatient && styles.currentPatientName,
                ]}
              >
                {patient.name}
              </Text>
              <Text
                style={[
                  styles.patientInfo,
                  isCurrentPatient && styles.currentPatientInfo,
                ]}
              >
                {patient.time} - {patient.address}
              </Text>
              {patient.nøkkelnummer ? (
                <Text
                  style={[
                    styles.patientKey,
                    isCurrentPatient && styles.currentPatientKey,
                  ]}
                >
                  Nøkkelnummer: {patient.nøkkelnummer}
                </Text>
              ) : null}
            </View>
            <Text
              style={[
                styles.patientStatus,
                isCurrentPatient && styles.currentPatientStatus,
              ]}
            >
              {patient.status}
            </Text>
          </TouchableOpacity>
        ) 
      })}
    </View>
  ) 

}
export default HomePage 