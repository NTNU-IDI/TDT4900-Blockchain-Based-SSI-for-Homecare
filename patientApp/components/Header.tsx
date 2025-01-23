import React from "react";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

interface HeaderProps {
  header: string;
  headerStyle?: TextStyle;
  iconStyle?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({ header, headerStyle, iconStyle }) => {
  const navigation = useNavigation();

  const handlePress = (screen: string) => {
    navigation.navigate(screen as never);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.rowContainer, iconStyle]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={30} color="#0D9276" />
        </TouchableOpacity>

        <Text style={[styles.header, headerStyle]}>{header}</Text>

        <TouchableOpacity onPress={() => handlePress("Home")}>
          <Icon name="home" size={30} color="#0D9276" />
        </TouchableOpacity>
      </View>

      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
    marginTop: 70,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 40,
    color: "#333",
  },
  line: {
    width: "100%",
    height: 3,
    backgroundColor: "#0D9276",
    marginTop: 40,
  },
});

export default Header;
