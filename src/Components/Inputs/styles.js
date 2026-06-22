import { StyleSheet } from "react-native";
import { AppFontFamily, AppColor } from "./../../Themes";
export default StyleSheet.create({
  mainView: {
    height: 85,
    width: "100%",
    marginBottom: 10,
    marginTop: 10,
    // backgroundColor: 'red',
    alignItems: "flex-start",
    justifyContent: "flex-start",
    overflow: "hidden"
  },
  textStyle: {
    color: AppColor.colors.black,
    fontFamily: AppFontFamily.fontFamily.museo_500,
    fontSize: 16
    // fontWeight:"300"
  },
  inputView: {
    flex: 1,
    height: 50,
    flexWrap:'nowrap'
    // backgroundColor: "red"
  },
  containerInputImage: {
    // flex: 1,
    marginTop: 15,
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: AppColor.colors.imageBackground,
    height: 50,
    backgroundColor: AppColor.colors.white
  },
  inputContainerImage: {
    width: 50,
    height: "100%",
    // alignSelf: 'center',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColor.colors.imageBackground,
    overflow: "hidden"
  },
  imageLogo: {
    width: 20,
    height: 20
  },
  textInputs: {
    paddingLeft: 7,
    paddingRight: 7,
    paddingTop: 14,
    paddingBottom: 14,
    height: 50,
    fontFamily: AppFontFamily.fontFamily.museo_500,
    color: AppColor.colors.inputColor,
    fontSize: 15,
    width: "100%",
  },
  noView: {
    width: 30,
    height: "100%",
    // alignSelf: 'center',
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
    overflow: "hidden",
    flexDirection: "row"
  },
  dropdownImage: {
    width: 11,
    height: 11,
    marginLeft: 2
  },
  countryText: {
    fontFamily: AppFontFamily.fontFamily.museo_500,
    color: AppColor.colors.inputColor,
    fontSize: 12
  },

  lineViewContact: {
    height: 23,
    backgroundColor: AppColor.colors.placeHolder,
    width: 0.5,
    marginLeft: 5
  }
});
