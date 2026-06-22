import { StyleSheet } from 'react-native'
import { AppColor, AppFontFamily, Dimensions } from './../../Themes';
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: AppColor.colors.white
    },
    inputColor: {
        color: AppColor.colors.placeHolder,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 16,
        width: "90%",
    },
    searchImage: {
        width: 20,
        height: 20,
        marginTop: "-1%"
    },
    containerInputImage: {
        alignItems: 'center',
        justifyContent: "center",
        height: 60,
        width: "100%",
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: AppColor.colors.placeHolder,
        overflow: "hidden",
        paddingTop: '10%',
        paddingBottom: Platform.OS == "ios" ? 25 : 0,
    },
    empty: {
        alignItems: 'center',
        marginTop: 20
    }
})