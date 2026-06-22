import { StyleSheet } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { AppFontFamily, Dimensions, AppColor } from '../../Themes';
export default StyleSheet.create({
    container: {
        height: Dimensions.deviceHeight,
        width: Dimensions.deviceWidth
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: AppColor.colors.opacitiveBlack
    },
    innerView: {
        position: 'absolute',
        right: 0,
        top: DeviceInfo.hasNotch() == true ? 80 : 60,
        paddingTop: 5,
        paddingBottom:5,
        backgroundColor: '#fff',
        alignSelf: "flex-end"
    },
    buttons: {
        height: 40,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 20,
        paddingRight:20,
    },
    menutxt: {
        fontFamily: AppFontFamily.fontFamily.regular,
        color: AppColor.colors.threeOne,
        fontSize: 17,
        fontWeight: '400'
    }

})