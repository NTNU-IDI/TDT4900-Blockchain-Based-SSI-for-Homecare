import { Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

// Screens
import HomePage from '../screens/HomePage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import JournalsPage from '../screens/JournalsPage';
import MorePage from '../screens/MorePage';
import MorePopUp from '../components/MorePopUp';
import { NavigationContainer } from '@react-navigation/native';
import NavigationStyles from '../styles/NavigationStyles';
import TasksPage from '../screens/TasksPage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Define Tab Navigator
const Tab = createBottomTabNavigator();

type TabBarIconProps = {
  color: string;
  size: number;
};

const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }: TabBarIconProps) => {
            let iconName: string;

            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Tasks':
                iconName = 'clipboard-text-outline';
                break;
              case 'Journal':
                iconName = 'folder-outline';
                break;
              case 'More':
                iconName = 'dots-horizontal';
                break;
              default:
                iconName = '';
            }

            return <Icon name={iconName} color={color} size={size} />;
          },
          tabBarActiveTintColor: '#006A70',
          tabBarInactiveTintColor: 'black',
          tabBarStyle: NavigationStyles.tabBar,
          headerShown: false,})}
      >
        <Tab.Screen name="Home" component={HomePage} options={{ title: 'Hjem' }} />
        <Tab.Screen name="Tasks" component={TasksPage} options={{ title: 'Gjøremål' }} />
        <Tab.Screen name="Journal" component={JournalsPage} options={{ title: 'Journaler' }} />
        <Tab.Screen name="More" component={MorePage} options={{ title: 'Mer' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
