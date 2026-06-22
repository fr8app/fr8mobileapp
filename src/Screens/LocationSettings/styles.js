import { StyleSheet } from 'react-native'
import { AppColor, AppFontFamily, Dimensions } from './../../Themes';
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: AppColor.colors.white,
    },
    boxView: {
        marginHorizontal: 20,
        marginVertical: 20,
        borderRadius: 15,
    },
    boxInnerView: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 15,
        shadowColor: 'black',
        shadowOffset: {
            width: 0.5,
            height: 0.5,
        },
        elevation: 5,
        shadowRadius: 3,
        shadowOpacity: 0.4,
        backgroundColor: '#fff',
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
    textStyle: {
        color: AppColor.colors.black,
        fontFamily: AppFontFamily.fontFamily.museo_500,
        fontSize: 18
    },
    title: {
        color: AppColor.colors.black,
        fontFamily: AppFontFamily.fontFamily.museo_500,
        fontSize: 25,
    },
    date: {
        color: AppColor.colors.black,
        fontFamily: AppFontFamily.fontFamily.museo_500,
        fontSize: 18,
        alignSelf: 'center'
    },
    titleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    description: {
        color: AppColor.colors.black,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 16
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
        height: Dimensions.deviceHeight / 1.25,
        justifyContent: 'center',
        alignItems: "center",
    },
    noValueText: {
        color: AppColor.colors.twoTwo,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 16,
    },
    text: {
        fontSize: 18,
        fontFamily: AppFontFamily.fontFamily.regular,
    }
})