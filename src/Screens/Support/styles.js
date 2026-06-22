import { StyleSheet } from 'react-native'
import { AppColor,AppFontFamily } from './../../Themes';
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: AppColor.colors.white
    },
    bottomView: {
        width: "100%",
        position: 'absolute',
        bottom: 30,
        alignSelf: "center"
    },
    androidBottomView: {
        width: "100%",
        flex:1,
        // backgroundColor:'red',
        justifyContent:'flex-end',
        marginBottom:30,
        marginTop:60,
        // position: 'absolute',
        // bottom: 30,
        alignSelf: "center"
    },
    textInputContainer: {
        marginTop:20,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 14,
        paddingBottom: 14,
        height: 130,
        fontFamily:AppFontFamily.fontFamily.regular,
        color: AppColor.colors.inputColor,
        fontSize: 16,
        width: "100%",
        borderRadius: 5,
        borderWidth: 1,
        borderColor:AppColor.colors.imageBackground,
        textAlignVertical:"top"
    }
})