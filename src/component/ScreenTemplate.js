import { StyleSheet, View } from "react-native";

const ScreenTemplate = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
});

export default ScreenTemplate;
