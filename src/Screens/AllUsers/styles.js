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
        // backgroundColor:'red'
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
    bottomView: {
        // paddingHorizontal:20,
        width: "90%",
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center'

    },
    textInput: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 14,
        paddingBottom: 14,
        height: 50,
        fontFamily: AppFontFamily.fontFamily.regular,
        color: AppColor.colors.placeHolder,
        fontSize: 16,
        // width: "90%",
        width: "85%"
    },
    bottomContainer: {
        width: "100%",
        alignSelf: "center",
        borderWidth: 1,
        backgroundColor: AppColor.colors.white,
        borderColor: AppColor.colors.imageBackground,
        // overflow: "hidden",
        flexDirection: "row",
    },
    imageView: {
        right:10,
        width: 60,
        height: 50,
        backgroundColor: AppColor.colors.darkBlue,
        justifyContent: "center",
        alignItems: "center"
    },
    sendImage: {
        width: 25, height: 25
    },
    noValueText: {
        color: AppColor.colors.twoTwo,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 16,
        textAlign: 'center',
        marginLeft: 15,
    },
  
    listEmptyComponentView: {
        height: Dimensions.deviceHeight / 1.2,
        justifyContent:'center',
    }
})