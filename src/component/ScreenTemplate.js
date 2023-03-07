import React from "react";
import { StyleSheet, View } from "react-native";

const ScreenTemplate = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

export default ScreenTemplate;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
});
