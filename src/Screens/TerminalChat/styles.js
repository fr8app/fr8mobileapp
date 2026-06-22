import { StyleSheet, Dimensions } from 'react-native'
import { AppColor, AppFontFamily, } from './../../Themes';
import deviceInfo from 'react-native-device-info';
const height = Dimensions.get("window").height
export default StyleSheet.create({
    mainContainer: {
        // flex: 1,
        // backgroundColor: AppColor.colors.white,
        backgroundColor: 'orange',
        height:height-0.75
    },
    mainSearchView: {
        width: "100%",
        flexDirection: 'row',
        marginTop: 20,
        paddingBottom: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: AppColor.colors.placeHolder,
        // overflow: "hidden"
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
    // bottomView: {
    //     // flex:0.129,
    //     // backgroundColor:"green",
    //     height: 80,
    //     // paddingHorizontal:20,
    //     width: "90%",
    //     alignSelf: "flex-end",
    //     // backgroundColor:'pink',
    //     // position: 'absolute',
    //     // bottom: deviceInfo.hasNotch() == true ? 0 : 30,
    //     alignSelf: 'center',
    //     marginTop:deviceInfo.hasNotch() == true? 0:50,
    //     paddingVertical: 15


    // },

     bottomView: {
        // flex:0.129,
        // backgroundColor:"green",
        height:80,
        // paddingHorizontal:20,
        width: "80%",
        // alignSelf:"flex-end",
        // borderWidth:1,
        // position: 'absolute',
        // bottom: deviceInfo.hasNotch() == true ? 0 : 30,
        alignSelf: 'center',
        marginTop:deviceInfo.hasNotch() == true? 0:22,
        marginBottom:20,
        paddingVertical:15
        // paddingVertical:5
        

    },
    textInput: {
        padding:10,
        // height: 50,
        maxHeight:height*0.05,
        fontFamily: AppFontFamily.fontFamily.regular,
        color: AppColor.colors.placeHolder,
        fontSize: 16,
        // width: "90%",
        width: "100%"
        // flex: 1
    },
    bottomContainer: {
        // width: "100%",
        flex: 1,
        
        alignSelf: "center",
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: AppColor.colors.white,
        borderColor: AppColor.colors.imageBackground,
        overflow: "hidden",
        flexDirection: "row",
        // overflow: 'hidden',
    },

    imageView: {
        // right:deviceInfo.hasNotch()==true? 0:Dimensions.deviceWidth>600?-50:0,
        width: 50,
        height: 50,
        backgroundColor: AppColor.colors.darkBlue,
        justifyContent: "center",
        alignItems: "center",
        // borderRadius:5,


    },
    sendImage: {
        width: 22, height: 22
    }
})