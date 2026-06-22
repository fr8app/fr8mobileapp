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
  tittleText: {
    color: AppColor.colors.black,
    fontFamily: AppFontFamily.fontFamily.bold,
    fontSize: 18,
    paddingLeft: 8,
  },
  descText: {
    color: AppColor.colors.black,
    fontFamily: AppFontFamily.fontFamily.regular,
    fontSize: 15,
    paddingLeft: 8,
  },
  outerImage: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: 'center',
  },

  innerImage: {
    height: '56%',
    width: '85%',
    position: "absolute",
    zIndex: 1,
    borderRadius: 2,
  },
  noValueText: {
    color: '#000',
    fontFamily: AppFontFamily.fontFamily.regular,
    fontSize: 16,
    textAlign: 'center',
    marginLeft: 15,
  },
  qaContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 20,
    backgroundColor: "rgba(216, 216, 216, 1)"
  },
  button: {
    justifyContent: "center"
  }
});
