import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import React, { useState } from 'react';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SCREEN_WIDTH = Dimensions.get('window').width;
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  
  const MorePopUp: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
  
    // Shared value for animation
    const translateX = useSharedValue(SCREEN_WIDTH);
  
    // Animated styles for the drawer
    const drawerStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));
  
    const toggleDrawer = () => {
      if (isOpen) {
        translateX.value = withTiming(SCREEN_WIDTH, { duration: 300 });
        setIsOpen(false);
      } else {
        translateX.value = withTiming(0, { duration: 300 });
        setIsOpen(true);
      }
    };
  
    const closeDrawer = () => {
      translateX.value = withTiming(SCREEN_WIDTH, { duration: 300 });
      setIsOpen(false);
    };
  
    return (
      <>
        {/* Tab Button */}
        <TouchableOpacity onPress={toggleDrawer} style={styles.iconButton}>
          <Icon name="dots-horizontal" size={24} color="black" />
        </TouchableOpacity>
  
        {/* Full-Screen Overlay */}
        {isOpen && (
          <TouchableWithoutFeedback onPress={closeDrawer}>
            <View style={styles.overlay}>
              {/* Sliding Drawer */}
              <Animated.View style={[styles.drawer, drawerStyle]}>
                <View style={styles.drawerContent}>
                  <Text style={styles.drawerTitle}>Mer</Text>
                  <TouchableOpacity
                    style={styles.drawerButton}
                    onPress={() => alert('Innstillinger')}
                  >
                    <Text style={styles.drawerButtonText}>Innstillinger</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.drawerButton}
                    onPress={() => alert('Logg ut')}
                  >
                    <Text style={styles.drawerButtonText}>Logg ut</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.drawerButton} onPress={closeDrawer}>
                    <Text style={styles.drawerButtonText}>Lukk</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        )}
      </>
    );
  };
  
  export default MorePopUp;
  
  const styles = StyleSheet.create({
    iconButton: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 60,
      width: 60,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      zIndex: 9,
    },
    drawer: {
      position: 'absolute',
      top: 0,
      right: 0, // Align to the right edge
      bottom: 0,
      width: SCREEN_WIDTH * 0.8, // Drawer width is 80% of the screen width
      height: SCREEN_HEIGHT, // Full screen height
      backgroundColor: '#FFF',
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: -2, height: 0 },
      shadowRadius: 5,
      elevation: 5,
      zIndex: 10,
    },
    drawerContent: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
    },
    drawerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#006A70',
    },
    drawerButton: {
      marginBottom: 15,
      padding: 15,
      backgroundColor: '#F4F4F4',
      borderRadius: 8,
    },
    drawerButtonText: {
      fontSize: 16,
      color: '#333',
    },
  });
  