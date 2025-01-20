import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';

import HomeStyles from '../styles/HomeStyles';

const HomeScreen: React.FC = () => {
    const [patients, setPatients] = useState([
        { id: '1', time: '09:00', name: 'Pasient 2', address: 'Osloveien 123', nøkkelnummer: '123', status: 'Påbegynt' },
        { id: '2', time: '09:30', name: 'Pasient 3', address: 'Singsakerbakken 3', nøkkelnummer: '234', status: 'Ikke startet' },
        { id: '3', time: '10:00', name: 'Pasient 4', address: 'Midtbyveien 1', nøkkelnummer: '', status: 'Ikke startet' },
        { id: '4', time: '10:15', name: 'Pasient 5', address: 'Moholtveien 2', nøkkelnummer: '567', status: 'Ikke startet' },
        { id: '5', time: '10:45', name: 'Pasient 6', address: 'Trondheimsveien 9', nøkkelnummer: '', status: 'Ikke startet' },
      ]);
  
  const currentDate = new Date().toLocaleDateString('no-NO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const renderPatient = ({ item }: { item: typeof patients[0] }) => (
    <View style={[HomeStyles.patientCard, item.status === 'Påbegynt' && HomeStyles.currentPatient]}>
      <View style={HomeStyles.timeContainer}>
        <Text style={HomeStyles.time}>{item.time}</Text>
      </View>
      <View style={HomeStyles.details}>
        <Text style={HomeStyles.name}>{item.name}</Text>
        <Text style={HomeStyles.address}>{item.address}</Text>
        {item.nøkkelnummer ? ( // Only show nøkkelnummer if it exists
          <Text style={HomeStyles.keyNumber}>Nøk: {item.nøkkelnummer}</Text>
        ) : null}
      </View>
      <Text style={[HomeStyles.status, item.status === 'Påbegynt' && HomeStyles.activeStatus]}>
        {item.status}
      </Text>
    </View>
  );

  return (
    <View style={HomeStyles.container}>
      {/* Header */}
      <View style={HomeStyles.header}>
        <Text style={HomeStyles.date}>{currentDate}</Text>
        <Text style={HomeStyles.headerText}>I dag har du {patients.length} pasienter</Text>
      </View>

      {/* Patient List */}
      <FlatList
        data={patients}
        renderItem={renderPatient}
        keyExtractor={(item) => item.id}
        contentContainerStyle={HomeStyles.list}
      />
    </View>
  );
};

export default HomeScreen;
