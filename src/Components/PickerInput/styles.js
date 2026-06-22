import { StyleSheet, Platform } from "react-native";
import { AppFontFamily, AppColor } from "./../../Themes";
export default StyleSheet.create({
  mainView: {
    height: 85,
    width: "100%",
    marginBottom: 10,
    marginTop: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  textStyle: {
    color: Platform.OS == "ios" ? AppColor.colors.black : null,
    fontFamily: AppFontFamily.fontFamily.museo_500,
    fontSize: 16
  },
  inputView: {
    flex: 1,
    height: 50
  },
  containerInputImage: {
    marginTop: 15,
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
    borderRadius: 5,
    borderWidth: 1,
    height: 50,
    backgroundColor: AppColor.colors.white,
    borderColor: AppColor.colors.imageBackground
  },
  inputContainerImage: {
    width: 50,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColor.colors.imageBackground
  },
  imageLogo: {
    width: 20,
    height: 20
  },
  placeHolderTextStyle: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 14,
    paddingBottom: 14,
    height: 50,
    fontFamily: AppFontFamily.fontFamily.museo_500,
    color: AppColor.colors.placeHolder,
    fontSize: 15,
    width: "100%"
  }
});
