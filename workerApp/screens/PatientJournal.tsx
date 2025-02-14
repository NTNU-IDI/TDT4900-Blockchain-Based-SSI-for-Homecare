import React, { useCallback, useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import BackButton from '../components/BackButton';
import { Patient } from '../types/patientInterfaces';
import SharedStyles from '../styles/SharedStyles';
import ToggleSection from '../components/ToggleSection';

const PatientJournal: React.FC<{ patient: Patient; onBack: () => void }> = ({
  patient,
  onBack
}) => {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = useCallback ((section: string) => {
    setOpenSections((prevSections) =>
      prevSections.includes(section)
        ? prevSections.filter((s) => s !== section)
        : [...prevSections, section]
    );
  }, []);

  const formatJournalTitle = (name: string): string => {
    if (!name) return 'Journal';
    return name.match(/[sxz]$/i) ? `${name}’ journal` : `${name}s journal`;
  };

  const isSectionOpen = useMemo(
    () => (section: string) => openSections.includes(section),
    [openSections]
  );

  return (
    <View style={SharedStyles.container}>
       <View style={SharedStyles.headerContainer}>
      <BackButton onPress={onBack} />
      <Text style={SharedStyles.headerTitle}>{formatJournalTitle(patient.name)}</Text>
      </View>
      <ToggleSection title="Diagnoseliste" isOpen={isSectionOpen('diagnoses')} onToggle={() => toggleSection('diagnoses')}>
        {patient.journal.diagnoses}
      </ToggleSection>
      <ToggleSection title="Medikamenter" isOpen={isSectionOpen('medications')} onToggle={() => toggleSection('medications')}>
        {patient.journal.medications}
      </ToggleSection>
      <ToggleSection title="Tidligere behandlinger" isOpen={isSectionOpen('previousTreatments')} onToggle={() => toggleSection('previousTreatments')}>
        {patient.journal.previousTreatments}
      </ToggleSection>
    </View>
  );
};

export default PatientJournal;