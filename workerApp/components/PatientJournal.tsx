import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';

const PatientJournal: React.FC<{ patient: any; onBack: () => void }> = ({ patient, onBack }) => {
  const [activeSections, setActiveSections] = useState<string[]>([]); // Track which sections are open

  // Toggle section visibility
  const toggleSection = (section: string) => {
    setActiveSections((prevSections) =>
      prevSections.includes(section)
        ? prevSections.filter((s) => s !== section) // Close section if already active
        : [...prevSections, section] // Open section if not active
    );
  };

  // Render section content dynamically
  const renderSectionContent = (data: string[]) => (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => <Text style={styles.sectionItem}>{item}</Text>}
      contentContainerStyle={styles.sectionContent}
    />
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>Tilbake</Text>
      </TouchableOpacity>

      {/* Patient Name */}
      <Text style={styles.title}>{patient.name}</Text>

      {/* Diagnoseliste Section */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection('diagnoses')}
      >
        <Text style={styles.sectionHeaderText}>Diagnoseliste</Text>
        <Text style={styles.sectionToggle}>
          {activeSections.includes('diagnoses') ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      {activeSections.includes('diagnoses') &&
        renderSectionContent(patient.journal.diagnoses)}

      {/* Medikamenter Section */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection('medications')}
      >
        <Text style={styles.sectionHeaderText}>Medikamenter</Text>
        <Text style={styles.sectionToggle}>
          {activeSections.includes('medications') ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      {activeSections.includes('medications') &&
        renderSectionContent(patient.journal.medications)}

      {/* Tidligere Behandlinger Section */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection('previousTreatments')}
      >
        <Text style={styles.sectionHeaderText}>Tidligere behandlinger</Text>
        <Text style={styles.sectionToggle}>
          {activeSections.includes('previousTreatments') ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      {activeSections.includes('previousTreatments') &&
        renderSectionContent(patient.journal.previousTreatments)}
    </View>
  );
};

export default PatientJournal;

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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#D8EFF4',
    marginBottom: 10,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionToggle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionContent: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});
