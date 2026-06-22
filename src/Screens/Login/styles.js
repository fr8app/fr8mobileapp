import { StyleSheet, Platform } from "react-native"
import { AppColor, AppFontFamily, Dimensions } from './../../Themes';
import DeviceInfo from 'react-native-device-info';

export default StyleSheet.create({
    logoImage: {
        width: 70 * 2.08,
        height: 70,
        alignSelf: 'center',
        top: DeviceInfo.hasNotch() == true ? 100 : Dimensions.deviceHeight < 600 ? 45 : 70
    },
    forgotText: {
        width: "100%",
        fontSize: 15,
        textDecorationLine: "underline",
        color: AppColor.colors.white,
        fontFamily: AppFontFamily.fontFamily.regular,
    },
    loginButtonView: {
        marginTop: Platform.OS == "ios" ? 40 : 20,
        flex: 0.075,
        alignItems: 'center',
    },
    forgotButton: {
        alignSelf: 'flex-start',
        marginTop: 8
    },
    signUpButton: {
        width: "100%",
        justifyContent: "center",
        backgroundColor: "red",
        flex: 1
    },
    accountText: {
        textAlign: "center",
        fontSize: 15,
        color: AppColor.colors.placeHolder,
        fontFamily: AppFontFamily.fontFamily.regular,

    }
})
