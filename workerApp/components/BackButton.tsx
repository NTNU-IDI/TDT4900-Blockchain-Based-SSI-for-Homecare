import Icon from 'react-native-vector-icons/SimpleLineIcons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface BackButtonProps {
  onPress: () => void;
  color?: string;
  size?: number;
}

const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  color = '#0D9276',
  size = 20
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
    <Icon name="arrow-left" size={size} color={color} />
  </TouchableOpacity>
);
export default BackButton;
