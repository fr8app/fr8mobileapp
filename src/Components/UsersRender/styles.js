import { StyleSheet } from "react-native";
import { AppFontFamily, AppColor } from "./../../Themes";
export default StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,  
    borderWidth: 1,
    borderColor: AppColor.colors.placeHolder,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 10,
  },
  borderLess: {
    flex: 1,
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: AppColor.colors.placeHolder,
    overflow: "hidden",
    // marginTop: 10,
    // marginBottom: 10,
  },
  userImageView: {
    flex: 0.25,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColor.colors.imageBackground,
    overflow: "hidden",
  },
  borderLessImage: {
    // flex: 0.25,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: AppColor.colors.imageBackground,
    overflow: "hidden",
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textView: {
    // flex: 0.55,
    // overflow:'hidden',
    paddingTop: 5,
    paddingBottom: 5,
  },

  tittleText: {
    color: AppColor.colors.black,
    fontFamily: AppFontFamily.fontFamily.regular,
    fontSize: 15,
    paddingLeft: 8,
  },
  descText: {
    color: AppColor.colors.placeHolder,
    fontFamily: AppFontFamily.fontFamily.regular,
    fontSize: 15,
    paddingLeft: 8,
  },

  selectedAcceptText: {
    color: AppColor.colors.darkBlue,
    fontSize: 14,
    fontFamily: AppFontFamily.fontFamily.regular,
  },
  acceptText: {
    color: AppColor.colors.white,
    fontSize: 14,
    fontFamily: AppFontFamily.fontFamily.regular,
  },
  dateTimeView: {
    flex: 0.42,
    flexDirection: "row",
    alignSelf: "flex-end",

    marginBottom: 10,
  },
  tickView: {
    flex: 0.42,
    flexDirection: "row",
    justifyContent: "flex-end",
    // alignSelf:'flex-end',

    // marginBottom:10
  },
  dateText: {
    color: AppColor.colors.placeHolder,
    fontSize: 10,
    fontFamily: AppFontFamily.fontFamily.regular,
  },
  crossButton: {
    marginRight: 20,
  },
});
