import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// components/Section.tsx
import React from 'react';
import SharedStyles from '../styles/SharedStyles';

interface SectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: string[];
}

const ToggleSection: React.FC<SectionProps> = ({ title, isOpen, onToggle, children }) => (
  <View style={{marginBottom: 10}}>
    <TouchableOpacity style={styles.sectionHeader} onPress={onToggle}>
      <Text style={SharedStyles.boldCardTitle}>{title}</Text>
      <Text style={SharedStyles.boldCardTitle}>{isOpen ? '▲' : '▼'}</Text>
    </TouchableOpacity>
    {isOpen && (
      <View style={styles.sectionContent}>
        {children.map((item, index) => (
          <Text key={index.toString()} style={SharedStyles.greyCardText}>
            {item}
          </Text>
        ))}
      </View>
    )}
  </View>
);

export default ToggleSection;

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#BBE2EC',
  },
  sectionContent: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
});
