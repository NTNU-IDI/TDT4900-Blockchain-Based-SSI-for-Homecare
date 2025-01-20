import { StyleSheet, Text, View } from 'react-native';

import React from 'react';

const JournalsPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Journals Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default JournalsPage;
