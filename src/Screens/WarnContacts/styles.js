import { StyleSheet, Platform } from 'react-native'
import { AppColor, AppFontFamily } from './../../Themes';
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: AppColor.colors.white
    },
    mainSearchView: {
        width: "100%",
        flexDirection: 'row',
        marginTop: 20,
        paddingBottom: Platform.OS == "ios" ? 15 : 0,
        borderBottomWidth: 0.5,
        borderBottomColor: AppColor.colors.placeHolder,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center"
    },
    searchImage: {
        width: 20,
        height: 20,
    },
    searchText: {
        color: AppColor.colors.placeHolder,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 14,
        marginLeft: 15,
        width: Platform.OS == "ios" ? "90%" : "80%",
    }

})