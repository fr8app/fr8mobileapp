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
    userImage: {
        width: 80,
        height: 80,
        borderRadius: 80 / 2
    },
    addFriendButton: {
        
        height: 35,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 2,

    },
    addFriendText: {
        color: AppColor.colors.white,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 15,
    },
    chatText: {
        color: AppColor.colors.darkBlue,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 15,

    },
    chatButton: {
        borderColor: AppColor.colors.lightBlue,
        borderRadius: 2,
        borderWidth: 1,
        paddingLeft: 45,
        paddingRight: 45,
        paddingTop: 3,
        paddingBottom: 3,
        height: 35,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    removeChatContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
    },
    userPostsText:{
        
        color: AppColor.colors.twoTwo,
        fontFamily: AppFontFamily.fontFamily.semiBold,
        fontSize: 15,
    },
    noOfPosts:{
        
        color: AppColor.colors.twoTwo,
        fontFamily: AppFontFamily.fontFamily.bold,
        fontSize: 16,
    },
    exporterText:{
        color: AppColor.colors.placeHolder,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 15,  
    },
    noValueText: {
        color: AppColor.colors.twoTwo,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 16,
        textAlign: 'center',
        marginLeft: 15,
    },
    listEmptyComponentView: {
        height: Dimensions.deviceHeight / 2,
        justifyContent:'center'
    }


})