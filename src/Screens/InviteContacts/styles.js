import { StyleSheet } from "react-native";
import { AppColor, AppFontFamily, Dimensions } from "./../../Themes";

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent"
  },
  container: {
    height: "15%",
    width: "100%"
  },
  flatList: {
    flex: 1,
    paddingBottom: 10
  },
  emptyListStyle: {
    height: Dimensions.deviceHeight / 1.4,
    justifyContent: "center",
    flex: 1,
    alignItems: "center"
  },
  emptyMessageStyle: {
    textAlign: "center",
    fontSize: 20,
    color: AppColor.colors.white,
    fontFamily: AppFontFamily.fontFamily.museo_500
  },
  renderView: {
    height: 80,
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 30,
    backgroundColor: "rgba(255,255,255,0.11)"
  },
  customContainer: {
    width: "60%",
    height: 35,
    borderRadius: 2
  },
  customBottomButton: {
    width: "80%",
    borderRadius: 2
  },
  textView: {
    flex: 0.6,
    justifyContent: "center"
  },
  buttonView: {
    flex: 0.4,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  nameText: {
    fontSize: 15,
    color: AppColor.colors.white,
    fontFamily: AppFontFamily.fontFamily.museo_500
  },
  bottomButtonView: {
    height: 60,
    justifyContent: "center",
    alignSelf: "center"
  },
  bottomButtonsView: {
    height: 150,
    width: "100%",
    justifyContent: "center"
  }
});
