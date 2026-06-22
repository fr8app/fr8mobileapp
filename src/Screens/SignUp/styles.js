import { StyleSheet } from 'react-native'
import { AppColor, AppFontFamily } from './../../Themes';
export default StyleSheet.create({
    mainContainer:  { flex: 1, backgroundColor: '#fff' },
    termsView: {
        marginTop: 15,
        width: "100%",
        flexDirection: "row",
        marginBottom: 15,
        alignItems:'center'
    },
    avatarImageButton: {
        alignSelf: 'center'
    },
    avatarImage: {
        width: 100,
        height: 100 / 1.10,
    },
    selectedAvtarImage:{
        width: 100,
        height: 100 ,
        borderRadius:100/2,
        // backgroundColor:'red'
    },
    checkBoxImage: {
        width: 20,
        height: 20
    },
    termsText: {
        fontSize: 15,
        color: AppColor.colors.placeHolder,
        fontFamily: AppFontFamily.fontFamily.regular,
        marginLeft:15
    }
})