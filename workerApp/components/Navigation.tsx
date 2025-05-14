import HomePage from '../screens/HomePage';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import JournalsPage from '../screens/JournalsPage';
import MorePage from '../screens/MorePage';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import StartTaskPage from '../screens/StartTaskPage';
import StartedTaskPage from '../screens/StartedTaskPage';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppSelector } from '../redux/hooks';

const Tab = createBottomTabNavigator();

const Navigation: React.FC = () => {
  const { currentClientId, clients } = useAppSelector(
    (state) => state.client
  );

  // Determine task screen based on current client status
  const getTaskScreen = () => {
    const currentClient = clients.find((p) => p.id === currentClientId);
    if (currentClient?.status === 'Påbegynt') {
      return StartedTaskPage;
    } else {
      return StartTaskPage;
    }
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            let iconName: string;

            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Tasks':
                iconName = 'notebook';
                break;
              case 'Journal':
                iconName = 'folder';
                break;
              case 'More':
                iconName = 'options';
                break;
              default:
                iconName = '';
            }
            return <Icon name={iconName} color={color} size={20} />;
          },
          tabBarActiveTintColor: '#0D9276',
          tabBarInactiveTintColor: 'black',
          tabBarStyle: styles.tabBar,
          headerShown: false
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomePage}
          options={{ title: 'Hjem' }}
        />
        <Tab.Screen
          name="Tasks"
          component={getTaskScreen()}
          options={{ title: 'Gjøremål' }}
        />
        <Tab.Screen
          name="Journal"
          component={JournalsPage}
          options={{ title: 'Journaler' }}
        />
        <Tab.Screen
          name="More"
          component={MorePage}
          options={{ title: 'Mer' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    height: 60,
    paddingBottom: 5
  }
});
