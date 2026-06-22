import { StyleSheet } from "react-native";
import { AppColor, AppFontFamily } from "../../Themes";
export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: AppColor.colors.white,
  },
  mainSearchView: {
    width: "100%",
    flexDirection: "row",
    marginTop: 20,
    // height:60,
    // paddingBottom: 10,
    paddingBottom: Platform.OS == "ios" ? 15 : 0,
    borderBottomWidth: 0.5,
    borderBottomColor: AppColor.colors.placeHolder,
    overflow: "hidden",
  },
  searchImage: {
    width: 20,
    height: 20,
    alignSelf: "center",
  },
  searchText: {
    color: AppColor.colors.placeHolder,
    fontFamily: AppFontFamily.fontFamily.regular,
    fontSize: 15,
    marginLeft: 15,
    width: "90%",
  },
  bottomView: {
    width: "90%",
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
  },
  textInput: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 14,
    paddingBottom: 14,
    height: 50,
    fontFamily: AppFontFamily.fontFamily.regular,
    color: AppColor.colors.placeHolder,
    fontSize: 16,
    width: "85%",
  },
  bottomContainer: {
    width: "100%",
    alignSelf: "center",
    borderWidth: 1,
    backgroundColor: AppColor.colors.white,
    borderColor: AppColor.colors.imageBackground,
    flexDirection: "row",
  },
  imageView: {
    right: 10,
    width: 60,
    height: 50,
    backgroundColor: AppColor.colors.darkBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  sendImage: {
    width: 25,
    height: 25,
  },
});
