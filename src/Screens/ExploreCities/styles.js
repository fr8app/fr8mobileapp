import { StyleSheet } from 'react-native'
import { AppColor, AppFontFamily, Dimensions } from './../../Themes';
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: AppColor.colors.white,
        paddingHorizontal: 20
    },
    listMainContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
        marginBottom: 12,
        width: "95%",
        alignSelf: "center"
    },
    noValueText: {
        color: AppColor.colors.twoTwo,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 16,
        textAlign: 'center',
        marginLeft: 15,
    },
    lineView: {
        width: "95%",
        height: 0.5,
        backgroundColor: AppColor.colors.placeHolder,
        alignSelf: "center"
    },
    listEmptyComponentView: {
        height: Dimensions.deviceHeight / 2,
        justifyContent:'center'
    },
    noValueText: {
        color: AppColor.colors.twoTwo,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 16,
        textAlign: 'center',
        marginLeft: 15,
    },
})