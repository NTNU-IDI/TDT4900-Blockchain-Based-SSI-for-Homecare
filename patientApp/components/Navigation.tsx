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
    // <View style={styles.div}>
    // <View style={styles.container}>
    //   {[
    //     'calendar',
    //     'chemistry',
    //     'bell',
    //     'envelope',
    //     'user',
    //     'docs',
    //   ].map((iconName, index) => (
    //     <View key={index} style={styles.card}>
    //       <Icon name={iconName} size={60} color="#FFFFF" />
    //     </View>
    //   ))}
    // </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  div: {
    flex: 1, // Takes up the full screen
    justifyContent: 'center', // Centers the content vertically
    alignItems: 'center', // Centers the content horizontally
    backgroundColor: '#f0f0f0', // Light background color for better contrast
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Center items horizontally
    alignItems: 'center', // Center items vertically
    //padding: 10,
  },
  card: {
    width: '35%', // Slightly smaller than 50% to add spacing between cards
    aspectRatio: 1, // Ensures the card is a square
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8, // Adds space between cards
    backgroundColor: '#fff', // White background for the card
    borderRadius: 10, // Rounded corners for the card
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow position for iOS
    shadowOpacity: 0.2, // Shadow transparency for iOS
    shadowRadius: 4, // Shadow blur for iOS
    elevation: 4, // Shadow for Android
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    color: '#000',
  },
});


export default Navigation;
