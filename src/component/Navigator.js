import { View, Button, StyleSheet } from "react-native";
import NavBtn from "./NavBtn";

const Navigator = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* <NavBtn icon="home" title="HOME" navigation={navigation}></NavBtn>
      <NavBtn icon="calendar" title="CALENDAR" navigation={navigation}></NavBtn>
      <NavBtn icon="dumbbell" title="LIBRARY" navigation={navigation}></NavBtn>
      <NavBtn
        icon="human-male"
        title="MY PAGE"
        navigation={navigation}
      ></NavBtn> */}
      <Button title="test" onPress={() => navigation.navigate("Home")}></Button>
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
