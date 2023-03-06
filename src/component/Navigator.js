import { View, Button, StyleSheet } from "react-native";
import NavBtn from "./NavBtn";

const Navigator = () => {
  return (
    <View style={styles.container}>
      <NavBtn icon="home" title="HOME"></NavBtn>
      <NavBtn icon="calendar" title="CALENDAR"></NavBtn>
      <NavBtn icon="dumbbell" title="LIBRARY"></NavBtn>
      <NavBtn icon="human-male" title="MY PAGE"></NavBtn>
    </View>
  );
};

export default Navigator;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    marginTop: "auto",
  },
});
