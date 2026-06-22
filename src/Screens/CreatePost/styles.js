import { StyleSheet } from 'react-native'
import { AppColor, AppFontFamily } from './../../Themes';
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: AppColor.colors.white
    },
    uploadImage:{
        width:220,
        height:220
    },
    accountText: {
        textAlign: "center",
        fontSize: 15,
        color: AppColor.colors.placeHolder,
        fontFamily: AppFontFamily.fontFamily.regular,

    }
})