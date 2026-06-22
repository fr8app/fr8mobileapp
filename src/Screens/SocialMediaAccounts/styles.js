import { StyleSheet } from 'react-native'
import { AppColor, AppFontFamily, Dimensions } from './../../Themes';
import deviceinfo from 'react-native-device-info';

export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: AppColor.colors.white,
    },
    facebookBack: {
        width: "100%",
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 5,
        overflow: "hidden",
        marginTop: 10,
        marginBottom: 10,
        overflow: "hidden",
    },
    logoImage: {
        marginLeft:15,
        width: 25,
        height: 25,
    },
    buttonText: {
        fontSize: 18,
        color: AppColor.colors.white,
        fontFamily: AppFontFamily.fontFamily.regular,
        textAlign: "center",
        flex: 0.8,
        // backgroundColor:'red'
    },
    imageView: {
        flex: deviceinfo.hasNotch() == true ? 0.2 : Dimensions.deviceWidth > 400 ? 0.35 :0.2,
        // backgroundColor:'green',
        // width:70,
        // height:50,
        justifyContent:'center',
        alignItems:'center'
    }
})