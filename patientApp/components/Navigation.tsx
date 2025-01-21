import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons'; 
import { useNavigation } from '@react-navigation/native';

const Navigation = () => {

  const navigation = useNavigation();
  
  const handlePress = (screen: string) => {
    navigation.navigate(screen as never);
    
  };

  return (
    <View style={styles.div}>
    <View style={styles.container}>
      {[
        { name: 'calendar', label: 'Timeavtaler', screen: 'Innsyn' },
        { name: 'chemistry', label: 'Prøvesvar', screen: 'Innsyn' },
        { name: 'bell', label: 'Legemidler', screen: 'Innsyn' },
        { name: 'envelope', label: 'Meldinger', screen: 'Innsyn' },
        { name: 'user', label: 'Tilganger', screen: 'Innsyn' },
        { name: 'docs', label: 'Dokumenter', screen: 'Innsyn' },
      ].map((icon, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => handlePress(icon.screen)}
        >
          <Icon name={icon.name} size={60} color="#000" />
          <Text style={styles.cardText}>{icon.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>

  );
};

const styles = StyleSheet.create({
  div: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f0f0f0', 
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center', 
 
  },
  card: {
    width: '35%', 
    aspectRatio: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 4, 
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    color: '#000',
  },
});


export default Navigation;
