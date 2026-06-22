import { StyleSheet } from "react-native";
import { AppColor, AppFontFamily } from "./../../Themes";

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "85%",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    top: 0,
    alignSelf: "center"
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "center"
  },
  text: {
    fontSize: 18,
    color: AppColor.colors.lightBlue,
    fontFamily: AppFontFamily.fontFamily.museo_500,
    textAlign: "center"
  },

  buttonContainer: {
    width: "45%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: AppColor.colors.lightBlue
  },
  customContainer: {
    width: "45%"
  },
  textStyle: {
    color: AppColor.colors.white,
    fontFamily: AppFontFamily.fontFamily.museo_500,
    fontSize: 20,
    textAlign: "center",
    paddingVertical: 10
  },
  bottonContainer: {
    flex: 1,
    justifyContent: "center"
  },
  contactPermissionView: {
    flex: 1.3,
    justifyContent: "flex-end"
  },
  allowView: {
    flex: 1,
    paddingTop: 70
  }
});
