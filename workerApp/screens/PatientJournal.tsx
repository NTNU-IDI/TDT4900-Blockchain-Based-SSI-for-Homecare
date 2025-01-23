import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import BackButton from '../components/BackButton'
import SharedStyles from '../styles/SharedStyles'

const PatientJournal: React.FC<{ patient: any; onBack: () => void }> = ({
  patient,
  onBack,
}) => {
  const [openSections, setOpenSections] = useState<string[]>([])

  const toggleSection = (section: string) => {
    setOpenSections((prevSections) =>
      prevSections.includes(section)
        ? prevSections.filter((s) => s !== section)
        : [...prevSections, section]
    )
  }

  const renderSectionContent = (data: string[]) => (
    <View style={styles.sectionContent}>
      {data.map((item, index) => (
        <Text key={index.toString()} style={styles.sectionItem}>
          {item}
        </Text>
      ))}
    </View>
  )

  return (
    <View style={SharedStyles.container}>
      <BackButton onPress={onBack} />
      <Text style={SharedStyles.title}>Journal for {patient.name}</Text>
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('diagnoses')}
        >
          <Text style={styles.sectionHeaderText}>Diagnoseliste</Text>
          <Text style={styles.sectionToggle}>
            {openSections.includes('diagnoses') ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
        {openSections.includes('diagnoses') &&
          renderSectionContent(patient.journal.diagnoses)}
      </View>
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('medications')}
        >
          <Text style={styles.sectionHeaderText}>Medikamenter</Text>
          <Text style={styles.sectionToggle}>
            {openSections.includes('medications') ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
        {openSections.includes('medications') &&
          renderSectionContent(patient.journal.medications)}
      </View>
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('previousTreatments')}
        >
          <Text style={styles.sectionHeaderText}>Tidligere behandlinger</Text>
          <Text style={styles.sectionToggle}>
            {openSections.includes('previousTreatments') ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
        {openSections.includes('previousTreatments') &&
          renderSectionContent(patient.journal.previousTreatments)}
      </View>
    </View>
  )
}

export default PatientJournal

const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#BBE2EC',
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
  },
  sectionItem: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
})
