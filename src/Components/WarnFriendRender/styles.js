import { StyleSheet } from 'react-native'
import { AppFontFamily, AppColor } from './../../Themes';
export default StyleSheet.create({

    mainView: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: AppColor.colors.placeHolder,
        overflow: 'hidden',
        marginTop: 5,
        marginBottom: 5

    },
    userImageView: {
        flex: 0.25,
        height:70,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: AppColor.colors.imageBackground,
        overflow:'hidden'
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius:25
    },
    textView: {
        flex: 0.55,
        overflow:'hidden',
        paddingTop:5,
        paddingBottom:5,
      
    },
    buttonView: {
        flex: 0.4,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
        overflow:'hidden',
        paddingRight:5 ,
        // backgroundColor:"green"
    },
    tittleText: {
        color: AppColor.colors.black,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 15,
        paddingLeft:8
    },
    descText: {
        color: AppColor.colors.placeHolder,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 15,
        paddingLeft:8
    },
    darkBlueButton: {
        backgroundColor: AppColor.colors.darkBlue,
        borderRadius: 2,
        paddingLeft:10    ,
        paddingBottom:7,
        paddingTop:7,
        paddingRight:10,
        marginRight:2,
        alignSelf:'center',
        alignItems:'center'
    },
    lightBlueButton: {
        backgroundColor: AppColor.colors.lightBlue,
        borderRadius: 2,
        paddingLeft:10,
        paddingBottom:7,
        paddingTop:7,
        paddingRight:10,
        alignItems:'center'
    },
    selectedButton: {
        borderColor: AppColor.colors.darkBlue,
        borderWidth: 1,
        borderRadius: 2,
        paddingLeft:8,
        paddingBottom:5,
        paddingTop:5,
        paddingRight:8,
        alignItems:'center'
    },
    selectedAcceptText: {
        color: AppColor.colors.darkBlue,
        fontSize: 14,
        fontFamily: AppFontFamily.fontFamily.regular,
    },
    acceptText: {
        color: AppColor.colors.white,
        fontSize: 14,
        fontFamily: AppFontFamily.fontFamily.regular,
    }


})