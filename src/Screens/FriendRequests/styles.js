import { StyleSheet } from 'react-native'
import { AppColor, AppFontFamily, Dimensions } from './../../Themes';
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: AppColor.colors.white
    },
    mainSearchView: {
        width: "100%",
        flexDirection: 'row',
        marginTop: 20,
        paddingBottom: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: AppColor.colors.placeHolder,
        overflow: "hidden"
    },
    searchImage: {
        width: 20,
        height: 20
    },
    searchText: {
        color: AppColor.colors.placeHolder,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 15,
        marginLeft: 15,
        width: "90%"
    },
    listEmptyComponentView: {
        height: Dimensions.deviceHeight /1.25,
        justifyContent: 'center',
        alignItems:"center",
    },
    noValueText: {
        color: AppColor.colors.twoTwo,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 16,
    },

})