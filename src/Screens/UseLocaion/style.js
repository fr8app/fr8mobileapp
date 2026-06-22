import { StyleSheet, Dimensions } from 'react-native'
import { AppFontFamily } from './../../Themes';
const height = Dimensions.get('screen').height
const width = Dimensions.get('screen').width
export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingVertical: 10
  },
  textStyle: {
    fontFamily: AppFontFamily.fontFamily.regular,
    fontSize: 20
  },
  bottom: {
    position: 'absolute',
    width: '100%',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20
  },
  button: {
    borderRadius: 8,
    height: 50,
    width: '40%'
  },
})