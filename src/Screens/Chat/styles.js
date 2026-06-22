import { StyleSheet, Dimensions } from 'react-native'
import { AppColor, AppFontFamily, } from './../../Themes';
import deviceInfo from 'react-native-device-info';
const height = Dimensions.get('window').height
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: AppColor.colors.white,
        height: height
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
    bottomView: {
        height: 80,
        width: "90%",
        alignSelf: 'center',
        marginTop: deviceInfo.hasNotch() == true ? 0 : 22,
        marginBottom: 20,
        paddingVertical: 15},
    textInput: {
        padding: 10,
        fontFamily: AppFontFamily.fontFamily.regular,
        color: AppColor.colors.placeHolder,
        fontSize: 16,
        width: "100%",
        maxHeight: height * 0.05,
    },
    bottomContainer: {
        flex: 1,
        alignSelf: "center",
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: AppColor.colors.white,
        borderColor: AppColor.colors.imageBackground,
        flexDirection: "row",
        overflow: 'hidden',
    },
    imageView: {
        width: 50,
        height: 50,
        backgroundColor: AppColor.colors.darkBlue,
        justifyContent: "center",
        alignItems: "center",
     },
    sendImage: {
        width: 22, height: 22
    },
    url: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    renderComposer: {
        flex: 1,
        justifyContent: 'center',
        height: height * 0.06
    },
    renderToolbar: {
        justifyContent: 'center',
        maxHeight: height * 0.07
    }
})