import { StyleSheet, Dimensions } from 'react-native';
import { AppFontFamily } from '../../Themes';
const { width, height } = Dimensions.get('screen')
const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    mainWrapper: {
        flex: 1,
        backgroundColor: 'black',
    },
    listEmptyComponentView: {
        height: height / 1.25,
        justifyContent: 'center',
        alignItems: "center"
    },
    noValueText: {
        fontFamily: AppFontFamily.fontFamily.regular,
        color: '#ffff'
    }
})
export default style;
