import { StyleSheet } from 'react-native'
import { AppColor } from './../../Themes';
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: AppColor.colors.white
    },
    bottomView: {
        width: "100%",
        position: 'absolute',
        bottom: 30,
        alignSelf:"center"
    }
})