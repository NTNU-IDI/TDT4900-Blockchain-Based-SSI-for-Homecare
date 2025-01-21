import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const JournalRequestPage: React.FC<{ patient: any; onBack: () => void }> = ({ patient, onBack }) => {
  const [requestSent, setRequestSent] = useState(false);
  const [note, setNote] = useState('');

  const handleRequestAccess = () => {
    setRequestSent(true); // Simulate sending request
    setTimeout(() => onBack(), 2000); // Return to JournalsPage after 2 seconds
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>Tilbake</Text>
      </TouchableOpacity>
      <Text style={styles.title}> Be om tilgang til journal</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Navn: </Text>
          Marte Mortensen {/* TODO: Hardcoded info about the worker */}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Arbeidsplass: </Text>
          Byåsen hjemmetjeneste {/* TODO: Hardcoded info about the worker */}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Yrke: </Text>
          Sykepleier {/* TODO: Hardcoded info about the worker */}
        </Text>
      </View>

      {!requestSent ? (
        <>
          <Text style={styles.noteLabel}>Notat:</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Legg til en notat for forespørselen..."
            multiline
            value={note}
            onChangeText={setNote}
          />
          <TouchableOpacity style={styles.requestButton} onPress={handleRequestAccess}>
            <Text style={styles.requestButtonText}>Send forespørsel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.requestSentContainer}>
          <Text style={styles.requestSentText}>Forespørsel sendt</Text>
        </View>
      )}
    </View>
  );
};

export default JournalRequestPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#006A70',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
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
  noteLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  noteInput: {
    height: 100,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#FFF',
  },
  requestButton: {
    backgroundColor: '#006A70',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  requestButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  requestSentContainer: {
    backgroundColor: '#D8EFF4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  requestSentText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
});
