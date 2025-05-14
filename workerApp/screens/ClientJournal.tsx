import React, { useCallback, useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import BackButton from '../components/BackButton';
import { Client } from '../types/client';
import SharedStyles from '../styles/SharedStyles';
import ToggleSection from '../components/ToggleSection';

const ClientJournal: React.FC<{ client: Client; onBack: () => void }> = ({
  client,
  onBack
}) => {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = useCallback((section: string) => {
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
        <Text style={SharedStyles.headerTitle}>
          {formatJournalTitle(client.name)}
        </Text>
      </View>
      <ToggleSection
        title="Diagnoseliste"
        isOpen={isSectionOpen('diagnoses')}
        onToggle={() => toggleSection('diagnoses')}
      >
        {client.journal.diagnoses}
      </ToggleSection>
      <ToggleSection
        title="Medikamenter"
        isOpen={isSectionOpen('medications')}
        onToggle={() => toggleSection('medications')}
      >
        {client.journal.medications}
      </ToggleSection>
      <ToggleSection
        title="Tidligere behandlinger"
        isOpen={isSectionOpen('previousTreatments')}
        onToggle={() => toggleSection('previousTreatments')}
      >
        {client.journal.previousTreatments}
      </ToggleSection>
    </View>
  );
};

export default ClientJournal;
