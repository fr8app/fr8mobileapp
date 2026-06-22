import { StyleSheet } from 'react-native'
import { AppFontFamily, AppColor, Dimensions } from './../../Themes';
export default StyleSheet.create({
    mainContainer: {
        width: "100%",
        backgroundColor: '#0d131c',
        borderTopColor: '#3b3b3c',
        borderLeftColor: '#3b3b3c',
        borderRightColor: '#3b3b3c'
    },
    userView: {
        flexDirection: 'row',
        width: "100%",
        borderBottomColor: '#3b3b3c',
        borderLeftColor: '#3b3b3c',
        borderRightColor: '#3b3b3c',
        margin: 10,
    },
    userImage: {
        width: 45,
        height: 45,
        borderRadius: 45 / 2
    },
    userPostsText: {
        color: AppColor.colors.twoTwo,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 16,
        textAlign: 'center',
        marginLeft: 15,
    },
    postImage: {
        width: Dimensions.deviceWidth ,
        height: (Dimensions.deviceWidth) / 2,
    },
    lineView: {
        width: "100%",
        height: 0.5,
        backgroundColor: AppColor.colors.placeHolder,
        marginTop: 20
    },
    postImageView: {
        overflow: 'hidden',
    },
    textInput: {
        padding: 10,
        fontFamily: AppFontFamily.fontFamily.regular,
        color: AppColor.colors.placeHolder,
        fontSize: 16,
        width: "100%",
        maxHeight: Dimensions.deviceHeight * 0.05,
    },
    imageView: {
        width: 55,
        height: 55,
        backgroundColor: AppColor.colors.darkBlue,
        justifyContent: "center",
        alignItems: "center",
    },
    sendImage: {
        width: 22, height: 22
    },
    bottomView: {
        width: Dimensions.deviceWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: Dimensions.deviceHeight * 0.068,
        // position: 'absolute',
        bottom: 0,
        borderTopWidth: 0.5,
        borderTopColor: 'silver'
    },
    flatListComment: {
        marginBottom: '5%',
        marginTop: 5
    },
    button: {
        borderRadius: 14,
        height: 50,
        width:'44%'
    },
})