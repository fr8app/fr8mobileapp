import { StyleSheet } from 'react-native'
import { AppColor, AppFontFamily, Dimensions } from './../../Themes';
export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: AppColor.colors.black,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    fontFamily: AppFontFamily.fontFamily.regular,
    fontSize: 20
  },

  inlineContainer: {
    flex: 1,
    // marginTop: 20,
  },
  noValueText: {
    color: '#000',
    fontFamily: AppFontFamily.fontFamily.regular,
    fontSize: 16,
    textAlign: 'center',
    marginLeft: 15,
  },
  flatList: {
    paddingBottom: 80,
  },
  listEmptyComponentView: {
    height: Dimensions.deviceHeight *0.7,
    justifyContent: 'center'
  },
  postButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    // height: 70,
    // width: 70,
    // borderRadius: 70 / 2,
    // backgroundColor: '#29a2e1',
    alignItems: 'center',
    justifyContent: 'center'
  }

})


