import { StyleSheet } from "react-native";
import { AppColor, AppFontFamily } from "../../Themes";

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8,
    marginRight: 14,

    alignItems: "flex-end",
  },
  chatView: {
    flexDirection: "row",
    flex: 1,
  },
  chatTrinagle: {
    transform: [{ rotate: '0deg' }],
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderRightColor: 'transparent',
    borderTopColor: "#bcbcbc"
  },
  messageView: {
    flex: 0.73,
    padding: 10,
    paddingLeft: 10,
    backgroundColor: "#bcbcbc"
  },
  userView: {
    flex: 0.18,
    alignItems: "center",
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
  },
  dateTimeText: {
    textAlign: "left",
    fontFamily: AppFontFamily.fontFamily.regular,
    color: AppColor.colors.placeHolder,
    fontSize: 14,
  },
  messageText: {
    fontFamily: AppFontFamily.fontFamily.regular,
    color: "#ffff",
    fontSize: 14,
  },
  nameText: {
    marginTop: 2,
    fontFamily: AppFontFamily.fontFamily.regular,
    color: AppColor.colors.placeHolder,
    fontSize: 14,
  },
});
