import { StyleSheet, Platform, StatusBar } from 'react-native';
import { AppColor, AppFontFamily, Dimensions } from './../../Themes';
import DeviceInfo from 'react-native-device-info';

export default StyleSheet.create({
    mainContainer: {
        flex: Platform.OS == "ios"? 1:0, 
        width: "100%",
        
        // height:  Platform.OS =="ios"? DeviceInfo.hasNotch() == true ? 100 : Dimensions.deviceHeight > 600 ?  75 : 60
        // : DeviceInfo.hasNotch() == true ? 100 : Dimensions.deviceHeight > 600 ?  75  : 60,
        height:  Platform.OS =="ios"? DeviceInfo.hasNotch() == true ? 100 : Dimensions.deviceHeight > 600 ?  75 : 60
        : DeviceInfo.hasNotch() == true ? 100 : Dimensions.deviceHeight > 600 ?  75  : 60,
    },
    container: {

        height:  Platform.OS =="ios"? DeviceInfo.hasNotch() == true ? 100 : Dimensions.deviceHeight > 600 ?  75 : 60
        : DeviceInfo.hasNotch() == true ? 100 : Dimensions.deviceHeight > 600 ?  75  : 60,
        // top: -2,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        flexDirection: 'row',
        flex: 1,
        paddingTop:Platform.OS=='android'?5: DeviceInfo.hasNotch() == true ? 30 : 10,
        paddingHorizontal:10
        // backgroundColor: "#176a9c"
    },
    background: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        display: 'flex'
    },
    rightBtn: {
        height: 20,
        width: 20,
        // backgroundColor: 'red'
    },
    headerTitle: {
        maxWidth:Dimensions.deviceWidth/2,
        marginLeft: 10,
        fontSize: 21,
        color: AppColor.colors.white,
        fontFamily: AppFontFamily.fontFamily.regular,
        // fontWeight:"bold"
    },
    headerTitleLessFont: {
        maxWidth:Dimensions.deviceWidth/1.5,
        marginLeft: 10,
        fontSize: 19,
        color: AppColor.colors.white,
        fontFamily: AppFontFamily.fontFamily.regular,
        // fontWeight:"bold"
    },
    leftbtn: {
        height: 20,
        width: 20,
        // backgroundColor:'red'
    },
    leftBtnView: {
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:"red",
        // marginRight:10
    },
    rightText:{
        fontSize: 16,
        color: AppColor.colors.white,
        fontFamily: AppFontFamily.fontFamily.regular,
       
    }

})