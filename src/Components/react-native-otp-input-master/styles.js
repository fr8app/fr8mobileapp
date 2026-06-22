import { StyleSheet } from "react-native";
import { AppColor, AppFontFamily } from "../../Themes";

export default styles = StyleSheet.create({
  defaultTextFieldStyle: {
    width: 45,
    height: 45,
    borderColor: "rgba(226, 226, 226, 1)",
    borderWidth: 1,
    borderRadius: 2,
    textAlign: "center"
  },
  titleStyle: {
    color: AppColor.colors.white,
    fontFamily: AppFontFamily.fontFamily.museo_500,
    fontSize: 16,
    textAlign: "center",
    paddingVertical: 10
  }
});
