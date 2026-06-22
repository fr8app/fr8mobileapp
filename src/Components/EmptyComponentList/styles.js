import { StyleSheet } from 'react-native'
import { AppFontFamily, AppColor } from '../../Themes';
export default StyleSheet.create({
    mainView: {
        width: "100%", height: "100%", justifyContent: "center", alignItems: "center", 

    },
    tittleText: {
        color: AppColor.colors.fourSeven,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 14,
   
    },
})