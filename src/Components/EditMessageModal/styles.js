import { StyleSheet } from "react-native";
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
    width: Dimensions.deviceWidth - 60,
    backgroundColor: AppColor.colors.white,
    alignItems: "center",
    borderRadius: 12,
    paddingTop: 10,
    borderColor: "#fff",
    borderWidth: 0.5
  },
  titleText: {
    fontFamily: AppFontFamily.fontFamily.museo_500,
    color: AppColor.colors.black,
    fontSize: 20,
    marginTop: 10,
    textAlign: "center"
  },
  phoneNumber: {
    fontFamily: AppFontFamily.fontFamily.museo_500,
    color: AppColor.colors.opacitiveBlack,
    fontSize: 16,
    marginTop: 20,
    textAlign: "center"
  },
  buttonView: {
    backgroundColor: "rgba(224,224,224,0.6)",
    width: "100%",
    height: 60,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12
  },
  inviteText: {
    fontFamily: AppFontFamily.fontFamily.museo_500,
    color: AppColor.colors.black,
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
