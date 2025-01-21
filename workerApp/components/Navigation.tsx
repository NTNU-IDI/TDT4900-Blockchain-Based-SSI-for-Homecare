// Screens
import HomePage from '../screens/HomePage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import JournalsPage from '../screens/JournalsPage';
import MorePage from '../screens/MorePage';
import { NavigationContainer } from '@react-navigation/native';
import NavigationStyles from '../styles/NavigationStyles';
import React from 'react';
import { RootState } from '../redux/store';
// Task Screens
import StartTaskPage from '../screens/StartTaskPage';
import StartedTaskPage from '../screens/StartedTaskPage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';

// Define Tab Navigator
const Tab = createBottomTabNavigator();

type TabBarIconProps = {
  color: string;
  size: number;
};

const Navigation: React.FC = () => {
  const { currentPatientId, patients } = useSelector((state: RootState) => state.patient);

  // Determine the appropriate task screen based on currentPatient sstarttaskstatus
  const getTaskScreen = () => {
    const currentPatient = patients.find((p) => p.id === currentPatientId);

    if (currentPatient?.status === 'Påbegynt') {
      return StartedTaskPage;
    } else {
      return StartTaskPage;
    }
  };

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
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomePage} options={{ title: 'Hjem' }} />
        <Tab.Screen
          name="Tasks"
          component={getTaskScreen()} // Dynamically set the task screen
          options={{ title: 'Gjøremål' }}
        />
        <Tab.Screen name="Journal" component={JournalsPage} options={{ title: 'Journaler' }} />
        <Tab.Screen name="More" component={MorePage} options={{ title: 'Mer' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
