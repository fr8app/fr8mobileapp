import { StyleSheet } from "react-native";
import { AppColor, AppFontFamily } from "../../Themes";

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8,
    alignItems: "flex-start",
  },
  chatView: {
    flexDirection: "row",
    flex: 1,
  },
  messageView: {
    flex: 0.73,
    padding: 10,
    paddingLeft: 15,
    backgroundColor: "#11436f"
  },
  chatTrinagle: {
    transform: [{ rotate: '90deg' }],
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderRightColor: 'transparent',
    borderTopColor: '#11436f'
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
    textAlign: "right",
    fontFamily: AppFontFamily.fontFamily.regular,
    color: AppColor.colors.placeHolder,
    fontSize: 14,
  },
  messageText: {
    fontFamily: AppFontFamily.fontFamily.regular,
    color: AppColor.colors.white,
    fontSize: 14,
  },
  nameText: {
    marginTop: 2,
    fontFamily: AppFontFamily.fontFamily.regular,
    color: AppColor.colors.placeHolder,
    fontSize: 14,
  },
});
