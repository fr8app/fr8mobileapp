import { StyleSheet } from "react-native";
import DeviceInfo from "react-native-device-info";
import { AppColor, AppFontFamily } from "./../../Themes";

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center"
  },
  phoneNumberView: {
    width: "80%",
    height: "100%",
    // flex: 1,
    // bottom: DeviceInfo.hasNotch() ? 50 : 15,
    alignSelf: "center",
    // justifyContent: 'center',
    // alignItems: 'center',
    position: "absolute"
    // right: 15
  },
  phoneNumberInputView: {
    flex: 0.4,
    justifyContent: "flex-start"
  },
  phoneSubmitView: {
    flex: 0.2,
    justifyContent: "flex-end",
    // marginBottom: 25,
  },
  backImage: {
    height: 17,
    width: 17
  },
  backImageView: {
    marginTop: 10,
    position: "absolute",
    top: DeviceInfo.hasNotch() == true ? 40 : 20,
    left: 12,
    zIndex: 11
    // backgroundColor: "red"
  },
  switchView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  verifyAc: {
    fontFamily: AppFontFamily.fontFamily.museo_500,
    paddingVertical: 20,
    fontSize: 18,
    alignSelf: "center",
    color: AppColor.colors.white
  },
  loginText: {
    fontFamily: AppFontFamily.fontFamily.museo_500,
    paddingBottom: 10,
    fontSize: 14,
    // alignSelf: "center",
    color: AppColor.colors.white
  },
  phoneImage: {
    height: 60,
    width: 60,
    justifyContent: "center"
  },
  privacyTerms: {
    fontFamily: AppFontFamily.fontFamily.museo_500,
    paddingTop: 10,
    // paddingHorizontal: 40,
    fontSize: 12,
    fontWeight: "500",
    alignSelf: "center",
    color: AppColor.colors.white
  },
  policyText: {
    fontFamily: AppFontFamily.fontFamily.museo_500,
    paddingTop: 10,
    // paddingHorizontal: 40,
    fontSize: 12,
    fontWeight: "500",
    alignSelf: "center",
    color: AppColor.colors.lightBlue
  },
  modelText: {
    fontFamily: AppFontFamily.fontFamily.museo_500,
    paddingBottom: 20,
    // paddingHorizontal: 40,
    fontSize: 12,
    fontWeight: "500",
    alignSelf: "center",
    color: AppColor.colors.white
  }
});
