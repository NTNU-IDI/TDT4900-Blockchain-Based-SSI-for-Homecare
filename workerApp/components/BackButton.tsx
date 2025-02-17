import { TouchableOpacity, ViewStyle } from 'react-native';

import Icon from 'react-native-vector-icons/SimpleLineIcons';
import React from 'react';

interface BackButtonProps {
  onPress: () => void;
  color?: string;
  size?: number;
  style?: ViewStyle;
}

const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  color = '#0D9276',
  size = 20,
  style
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={style}>
    <Icon name="arrow-left" size={size} color={color} />
  </TouchableOpacity>
);
export default BackButton;
