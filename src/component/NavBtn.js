import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const NavBtn = ({ icon, title }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={1}>
      <MaterialCommunityIcons
        name={icon}
        size={40}
        color="#808080"
      ></MaterialCommunityIcons>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default NavBtn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  text: {
    fontWeight: "bold",
    color: "#808080",
  },
});
