import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'

import BackButton from '../components/BackButton'
import GreenButton from '../components/GreenButton'
import SharedStyles from '../styles/SharedStyles'
import { updateAccessRequest } from '../redux/patientSlicer'
import { useAppDispatch, } from '../redux/hooks'

const JournalRequest: React.FC<{ patient: any ; onBack: () => void }> = ({ patient, onBack }) => {
  const dispatch = useAppDispatch() 
  const [requestSent, setRequestSent] = useState(false) 
  const [note, setNote] = useState('')

  const handleRequestAccess = () => {
    dispatch(updateAccessRequest(patient.id)) 
    setRequestSent(true) 
    setTimeout(() => onBack(), 2000) 
  } 

  return (
    <View style={SharedStyles.container}>
      <BackButton onPress={onBack} />
      <Text style={SharedStyles.title}>Be om tilgang til journal</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Navn: </Text>
          Mona Jensen {/* Hardcoded for example */}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Arbeidsplass: </Text>
          Byåsen hjemmetjeneste {/* Hardcoded for example */}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Yrke: </Text>
          Sykepleier {/* Hardcoded for example */}
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
  ) 
} 

export default JournalRequest 

const styles = StyleSheet.create({
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  requestSentContainer: {
    backgroundColor: '#BBE2EC',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  requestSentText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
}) 
