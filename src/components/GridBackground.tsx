import { StyleSheet, View } from "react-native";

import { colors } from "@/constants/colors";

export function GridBackground() {
  return <View style={styles.background} pointerEvents="none" />;
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.2,
    backgroundColor: colors.background,
  },
});
