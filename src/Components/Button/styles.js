import { StyleSheet } from "react-native";
import { AppColor, AppFontFamily } from "./../../Themes";

export default StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 5,
    overflow: "hidden"
  },

  text: {
    fontSize: 18,
    color: AppColor.colors.white,
    fontFamily: AppFontFamily.fontFamily.museo_500,
    textAlign: "center"
    // fontWeight:"400"
  },

  buttonContainer: {
    width: "80%",
    height: 50,
    flex: 1,
    justifyContent: "center"
  }
});
