import { StyleSheet } from 'react-native'
import { AppColor, AppFontFamily } from './../../Themes';
export default StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#fff' },
    termsView: {
        marginTop: 15,
        width: "100%",
        flexDirection: "row",
        marginBottom: 15
    },
    avatarImageButton: {
        alignSelf: 'center',
    },
    avatarImage: {
        width: 100,
        height: 100 / 1.10,
    },
    checkBoxImage: {
        width: 20,
        height: 20
    },
    termsText: {
        fontSize: 15,
        color: AppColor.colors.placeHolder,
        fontFamily: AppFontFamily.fontFamily.regular,
        marginLeft: 15
    },
    marginTop40: {
        marginTop: 40
    },
    scrollView: {
        paddingTop: 20,
        paddingBottom: 35
    }
})