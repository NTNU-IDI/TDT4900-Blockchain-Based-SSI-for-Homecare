import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAppDispatch, useAppSelector } from '../redux/hooks'

import React from 'react'
import { updatePatientStatus } from '../redux/patientSlicer'

const StartTaskPage: React.FC = () => {
  const { currentPatientId, patients } = useAppSelector((state) => state.patient) 
  const dispatch = useAppDispatch() 

  const currentPatient = patients.find((p) => p.id === currentPatientId) 

  if (!currentPatient) {
    return (
      <View style={styles.container}>
        <Text style={styles.noPatientText}>Ingen pasient valgt</Text>
      </View>
    ) 
  }

  const [startHour, startMinute] = currentPatient.time.split(':').map(Number)
  const totalDuration = currentPatient.tasks.reduce((sum, task) => sum + task.duration, 0)
  const endTime = new Date() 
  
  endTime.setHours(startHour, startMinute + totalDuration) 

  const formattedEndTime = endTime.toTimeString().slice(0, 5)

  const handleStart = () => {
    dispatch(updatePatientStatus({ status: 'Påbegynt' })) 
  } 

  return (
    <View style={styles.container}>
      <Text style={styles.patientText}>{currentPatient.name}</Text>
      <Text style={styles.patientTime}>
        {currentPatient.time} - {formattedEndTime}
      </Text>
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
  ) 
} 

export default StartTaskPage 

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
    marginBottom: 10,
    color: '#333',
  },
  patientTime: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
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
}) 
