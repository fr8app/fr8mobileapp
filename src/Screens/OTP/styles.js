import { StyleSheet } from 'react-native'
import { AppColor, AppFontFamily } from './../../Themes';
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: AppColor.colors.white
    },
    bottomView: {
        width: "100%",
        position: 'absolute',
        bottom: 30,
        alignSelf: "center",
        backgroundColor:'orange'
    },
    resendText: {
        marginTop: 5,
        fontFamily: AppFontFamily.fontFamily.regular,
        color: AppColor.colors.placeHolder,
        fontSize: 15,
    },
    resendButton: {
        width: 100
    }
})