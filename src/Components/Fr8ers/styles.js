import { StyleSheet } from "react-native";
import { AppFontFamily, AppColor } from "./../../Themes";
export default StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: AppColor.colors.placeHolder,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 10
  },
  userImageView: {
    flex: 0.18,
    // height:"100%",
    height: 55,
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColor.colors.imageBackground,
    overflow: "hidden"
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15
  },
  textView: {
    flex: 0.55,
    overflow: "hidden",
    paddingTop: 5,
    paddingBottom: 5
  },
  buttonView: {
    flex: 0.25,
    marginRight:10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "hidden"
    // marginRight:15 ,
    // marginLeft:5,
    // backgroundColor:"green"
  },
  tittleText: {
    color: AppColor.colors.fourSeven,
    fontFamily: AppFontFamily.fontFamily.regular,
    fontSize: 14,
    paddingLeft: 8
  },
  descText: {
    color: AppColor.colors.fourSeven,
    fontFamily: AppFontFamily.fontFamily.regular,
    fontSize: 10,
    paddingLeft: 8
  },
  darkBlueButton: {
    backgroundColor: AppColor.colors.darkBlue,
    borderRadius: 2,
    paddingLeft: 8,
    paddingBottom: 5,
    paddingTop: 5,
    paddingRight: 8,
    marginRight: 2,
    alignSelf: "center"
  },
  lightBlueButton: {
    backgroundColor: AppColor.colors.lightBlue,
    borderRadius: 2,
    paddingLeft: 8,
    paddingBottom: 5,
    paddingTop: 5,
    paddingRight: 8
    // marginLeft:2
  },
  selectedButton: {
    borderColor: AppColor.colors.darkBlue,
    borderWidth: 1,
    borderRadius: 2,
    paddingLeft: 8,
    paddingBottom: 5,
    paddingTop: 5,
    paddingRight: 8
  },
  selectedAcceptText: {
    color: AppColor.colors.darkBlue,
    fontSize: 14,
    fontFamily: AppFontFamily.fontFamily.regular
  },
  acceptText: {
    color: AppColor.colors.white,
    fontSize: 12,
    fontFamily: AppFontFamily.fontFamily.regular
  },
  addUserImage: {
    width: 20,
    height: 20
    // backgroundColor:"red"
  },
  inviteText: {
    color: AppColor.colors.darkBlue,
    fontSize: 16,
    fontFamily: AppFontFamily.fontFamily.regular
  }
});
