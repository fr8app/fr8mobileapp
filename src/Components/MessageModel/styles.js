import { StyleSheet, Platform } from "react-native";
import { Dimensions, AppColor, AppFontFamily } from "../../Themes";
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "rgba(0,0,0,0.7)"
  },
  container: {
    width: Dimensions.deviceWidth - 65,
    // height:Dimensions.deviceHeight/2.5,
    backgroundColor: AppColor.colors.white,
    alignItems: "center",
    borderRadius: 12,
    // paddingLeft:8,
    // paddingRight:8,
    paddingTop: 10,
    paddingBottom: 20,
    borderColor: "#fff",
    borderWidth: 0.5
  },
  titleText: {
    fontFamily: AppFontFamily.fontFamily.museo_500,
    // color: AppColor.colors.black,
    fontSize: 18,
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    paddingHorizontal: 40
  },
  messagetext: {
    fontFamily: AppFontFamily.fontFamily.museo_500,
    color: AppColor.colors.opacitiveBlack,
    fontSize: 14,
    marginTop: 10,
    paddingBottom: 20,
    textAlign: "center",
    alignSelf: "center",
    paddingHorizontal: 10
  },
  phoneNumber: {
    fontFamily: AppFontFamily.fontFamily.museo_500,
    color: AppColor.colors.opacitiveBlack,
    fontSize: 16,
    marginTop: 20,
    textAlign: "center"
  },
  buttonView: {
    backgroundColor: AppColor.colors.lightBlue,
    width: "90%",
    paddingHorizontal: 10,
    height: 50,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 20
  },
  inviteText: {
    fontFamily: AppFontFamily.fontFamily.museo_500,
    color: AppColor.colors.white,
    fontSize: 20,
    textAlign: "center"
  },
  inputView: {
    width: "90%"
  },
  textInputs: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 14,
    paddingBottom: 14,
    height: 150,
    fontFamily: AppFontFamily.fontFamily.museo_500,
    color: AppColor.colors.inputColor,
    fontSize: 15,
    width: "100%",
    backgroundColor: "rgba(224,224,224,0.6)",
    marginBottom: 30,
    justifyContent: "center",
    marginTop: 20
  }
});
export default styles;
