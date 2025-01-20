import { StyleSheet, Text, View } from 'react-native';

import React from 'react';

const TasksPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Tasks Page</Text>
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

export default TasksPage;
